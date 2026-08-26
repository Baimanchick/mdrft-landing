#!/usr/bin/env bash

set -Eeuo pipefail

SCRIPT_DIRECTORY="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIRECTORY="$(cd -- "$SCRIPT_DIRECTORY/../.." && pwd)"
ENVIRONMENT_FILE="$PROJECT_DIRECTORY/.env.production"
COMPOSE_FILE="$PROJECT_DIRECTORY/compose.production.yml"
SUBMISSION_ID="${1:-}"

if [[ ! "$SUBMISSION_ID" =~ ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89aAbB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$ ]]; then
  printf '%s\n' "A valid version-4 submission UUID is required" >&2
  exit 1
fi

set -a
source "$ENVIRONMENT_FILE"
set +a

docker compose --env-file "$ENVIRONMENT_FILE" -f "$COMPOSE_FILE" exec -T postgres \
  psql \
  --username "$POSTGRES_ADMIN_USER" \
  --dbname "$POSTGRES_DB" \
  --set submission_id="$SUBMISSION_ID" \
  --command "UPDATE telegram_outbox SET status = 'pending', attempt_count = 0, available_at = clock_timestamp(), locked_at = NULL, lock_token = NULL, last_error_code = NULL, updated_at = clock_timestamp() WHERE lead_id = :'submission_id'::uuid AND status = 'dead_letter';"
