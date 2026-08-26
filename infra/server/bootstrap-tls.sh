#!/usr/bin/env bash

set -Eeuo pipefail

SCRIPT_DIRECTORY="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIRECTORY="$(cd -- "$SCRIPT_DIRECTORY/../.." && pwd)"
ENVIRONMENT_FILE="$PROJECT_DIRECTORY/.env.production"
COMPOSE_FILE="$PROJECT_DIRECTORY/compose.production.yml"

if [[ ! -f "$ENVIRONMENT_FILE" ]]; then
  printf '%s\n' "Missing $ENVIRONMENT_FILE" >&2
  exit 1
fi

set -a
source "$ENVIRONMENT_FILE"
set +a

if [[ ! "${APP_IMAGE:-}" =~ ^[^[:space:]]+@sha256:[a-f0-9]{64}$ ]]; then
  printf '%s\n' "APP_IMAGE must use an immutable sha256 digest" >&2
  exit 1
fi

if [[ ! "${DOMAIN:-}" =~ ^[a-zA-Z0-9.-]+$ || ! "${LETSENCRYPT_EMAIL:-}" =~ ^[^[:space:]@]+@[^[:space:]@]+$ ]]; then
  printf '%s\n' "DOMAIN or LETSENCRYPT_EMAIL is invalid" >&2
  exit 1
fi

COMPOSE=(docker compose --env-file "$ENVIRONMENT_FILE" -f "$COMPOSE_FILE")

"${COMPOSE[@]}" --profile tools pull postgres app telegram-worker migrate nginx nginx-bootstrap
"${COMPOSE[@]}" --profile tools run --rm migrate
"${COMPOSE[@]}" --profile bootstrap up -d postgres app nginx-bootstrap
"${COMPOSE[@]}" --profile tls run --rm certbot certonly \
  --webroot \
  --webroot-path /var/www/certbot \
  --domain "$DOMAIN" \
  --email "$LETSENCRYPT_EMAIL" \
  --agree-tos \
  --no-eff-email \
  --non-interactive \
  --keep-until-expiring
"${COMPOSE[@]}" --profile bootstrap stop nginx-bootstrap
"${COMPOSE[@]}" --profile bootstrap rm -f nginx-bootstrap
"${COMPOSE[@]}" up -d --remove-orphans postgres app telegram-worker nginx
printf '%s\n' "$APP_IMAGE" >"$PROJECT_DIRECTORY/.last-successful-image"
