#!/usr/bin/env bash

set -Eeuo pipefail

SCRIPT_DIRECTORY="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIRECTORY="$(cd -- "$SCRIPT_DIRECTORY/../.." && pwd)"
ENVIRONMENT_FILE="$PROJECT_DIRECTORY/.env.production"
COMPOSE_FILE="$PROJECT_DIRECTORY/compose.production.yml"
COMPOSE=(docker compose --env-file "$ENVIRONMENT_FILE" -f "$COMPOSE_FILE")

"${COMPOSE[@]}" --profile tls run --rm certbot renew \
  --webroot \
  --webroot-path /var/www/certbot \
  --non-interactive
"${COMPOSE[@]}" exec -T nginx nginx -s reload
