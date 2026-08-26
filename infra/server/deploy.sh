#!/usr/bin/env bash

set -Eeuo pipefail

SCRIPT_DIRECTORY="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIRECTORY="$(cd -- "$SCRIPT_DIRECTORY/../.." && pwd)"
ENVIRONMENT_FILE="$PROJECT_DIRECTORY/.env.production"
COMPOSE_FILE="$PROJECT_DIRECTORY/compose.production.yml"
STATE_FILE="$PROJECT_DIRECTORY/.last-successful-image"
DEPLOY_LOCK="$PROJECT_DIRECTORY/.deploy.lock"
NEXT_IMAGE="${1:-}"
STAGING_DIRECTORY=""
BUNDLE_CONTAINER=""
CONFIGURATION_BACKUP=""
DEPLOYMENT_SUCCEEDED="false"

if [[ ! -f "$ENVIRONMENT_FILE" ]]; then
  printf '%s\n' "Missing $ENVIRONMENT_FILE" >&2
  exit 1
fi

if [[ ! "$NEXT_IMAGE" =~ ^[^[:space:]]+@sha256:[a-f0-9]{64}$ ]]; then
  printf '%s\n' "Deployment requires an immutable image digest" >&2
  exit 1
fi

exec 9>"$DEPLOY_LOCK"
flock -n 9 || {
  printf '%s\n' "Another deployment is already running" >&2
  exit 1
}

COMPOSE=(docker compose --env-file "$ENVIRONMENT_FILE" -f "$COMPOSE_FILE")
PREVIOUS_IMAGE=""

if [[ -f "$STATE_FILE" ]]; then
  PREVIOUS_IMAGE="$(<"$STATE_FILE")"
fi

cleanup() {
  if [[ "$DEPLOYMENT_SUCCEEDED" != "true" ]]; then
    restore_configuration || true
  fi

  if [[ -n "$BUNDLE_CONTAINER" ]]; then
    docker rm -f "$BUNDLE_CONTAINER" >/dev/null 2>&1 || true
  fi

  if [[ -n "$STAGING_DIRECTORY" && -d "$STAGING_DIRECTORY" ]]; then
    rm -rf -- "$STAGING_DIRECTORY"
  fi

  rm -rf -- "$PROJECT_DIRECTORY/.infra.next"
  rm -f -- "$PROJECT_DIRECTORY/.compose.production.next.yml"
}

trap cleanup EXIT

activate_configuration() {
  docker pull "$NEXT_IMAGE" >/dev/null
  STAGING_DIRECTORY="$(mktemp -d "$PROJECT_DIRECTORY/.deployment.XXXXXX")"
  BUNDLE_CONTAINER="$(docker create "$NEXT_IMAGE")"
  docker cp "$BUNDLE_CONTAINER:/app/deployment/." "$STAGING_DIRECTORY"
  docker rm "$BUNDLE_CONTAINER" >/dev/null
  BUNDLE_CONTAINER=""

  [[ -f "$STAGING_DIRECTORY/compose.production.yml" ]]
  [[ -x "$STAGING_DIRECTORY/infra/server/deploy.sh" ]]
  bash -n "$STAGING_DIRECTORY"/infra/server/*.sh
  APP_IMAGE="$NEXT_IMAGE" docker compose \
    --env-file "$ENVIRONMENT_FILE" \
    -f "$STAGING_DIRECTORY/compose.production.yml" \
    config --quiet

  CONFIGURATION_BACKUP="$(mktemp -d "$PROJECT_DIRECTORY/.configuration-backup.XXXXXX")"
  cp -a -- "$COMPOSE_FILE" "$CONFIGURATION_BACKUP/compose.production.yml"
  cp -a -- "$PROJECT_DIRECTORY/infra" "$CONFIGURATION_BACKUP/infra"
  mv -- "$STAGING_DIRECTORY/compose.production.yml" "$PROJECT_DIRECTORY/.compose.production.next.yml"
  mv -- "$STAGING_DIRECTORY/infra" "$PROJECT_DIRECTORY/.infra.next"
  mv -f -- "$PROJECT_DIRECTORY/.compose.production.next.yml" "$COMPOSE_FILE"
  rm -rf -- "$PROJECT_DIRECTORY/infra"
  mv -- "$PROJECT_DIRECTORY/.infra.next" "$PROJECT_DIRECTORY/infra"
}

restore_configuration() {
  if [[ -z "$CONFIGURATION_BACKUP" || ! -d "$CONFIGURATION_BACKUP" ]]; then
    return
  fi

  rm -rf -- "$PROJECT_DIRECTORY/infra"
  mv -f -- "$CONFIGURATION_BACKUP/infra" "$PROJECT_DIRECTORY/infra"
  mv -f -- "$CONFIGURATION_BACKUP/compose.production.yml" "$COMPOSE_FILE"
  rmdir "$CONFIGURATION_BACKUP"
  CONFIGURATION_BACKUP=""
}

wait_for_health() {
  local service="$1"
  local container_id
  local status

  container_id="$("${COMPOSE[@]}" ps -q "$service")"

  if [[ -z "$container_id" ]]; then
    return 1
  fi

  for _ in {1..30}; do
    status="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$container_id")"

    if [[ "$status" == "healthy" || "$status" == "running" ]]; then
      return 0
    fi

    if [[ "$status" == "unhealthy" || "$status" == "exited" || "$status" == "dead" ]]; then
      return 1
    fi

    sleep 4
  done

  return 1
}

rollback() {
  restore_configuration

  if [[ -z "$PREVIOUS_IMAGE" || "$PREVIOUS_IMAGE" == "$NEXT_IMAGE" ]]; then
    return 1
  fi

  export APP_IMAGE="$PREVIOUS_IMAGE"
  "${COMPOSE[@]}" up -d --no-deps app telegram-worker
  wait_for_health app
}

activate_configuration
export APP_IMAGE="$NEXT_IMAGE"
"${COMPOSE[@]}" --profile tools pull postgres app telegram-worker migrate nginx
"${COMPOSE[@]}" --profile tools run --rm migrate
"${COMPOSE[@]}" up -d --remove-orphans postgres app telegram-worker nginx

if ! wait_for_health app || ! wait_for_health nginx; then
  printf '%s\n' "Deployment health check failed" >&2

  if rollback; then
    printf '%s\n' "Application containers rolled back to the previous image" >&2
  fi

  exit 1
fi

STATE_TEMPORARY="$STATE_FILE.tmp"
printf '%s\n' "$NEXT_IMAGE" >"$STATE_TEMPORARY"
mv -f -- "$STATE_TEMPORARY" "$STATE_FILE"

if [[ -n "$CONFIGURATION_BACKUP" && -d "$CONFIGURATION_BACKUP" ]]; then
  rm -rf -- "$CONFIGURATION_BACKUP"
  CONFIGURATION_BACKUP=""
fi

DEPLOYMENT_SUCCEEDED="true"
docker image prune -a -f --filter "until=168h" >/dev/null
"${COMPOSE[@]}" ps
