#!/usr/bin/env bash

set -Eeuo pipefail

SCRIPT_DIRECTORY="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIRECTORY="$(cd -- "$SCRIPT_DIRECTORY/../.." && pwd)"
ENVIRONMENT_FILE="$PROJECT_DIRECTORY/.env.production"
COMPOSE_FILE="$PROJECT_DIRECTORY/compose.production.yml"

set -a
source "$ENVIRONMENT_FILE"
set +a

BACKUP_DIRECTORY="${BACKUP_DIR:-/var/backups/mdrift-postgres}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-7}"

if [[ -z "$BACKUP_DIRECTORY" || "$BACKUP_DIRECTORY" == "/" || ! "$RETENTION_DAYS" =~ ^[1-9][0-9]*$ ]]; then
  printf '%s\n' "Backup configuration is invalid" >&2
  exit 1
fi

mkdir -p -- "$BACKUP_DIRECTORY"
chmod 700 "$BACKUP_DIRECTORY"

BACKUP_FILE="$BACKUP_DIRECTORY/mdrift-$(date -u +%Y%m%dT%H%M%SZ).dump"
TEMPORARY_FILE="$BACKUP_FILE.tmp"
trap 'rm -f -- "$TEMPORARY_FILE"' EXIT

docker compose --env-file "$ENVIRONMENT_FILE" -f "$COMPOSE_FILE" exec -T postgres \
  pg_dump \
  --username "$POSTGRES_ADMIN_USER" \
  --dbname "$POSTGRES_DB" \
  --format custom \
  --compress 6 >"$TEMPORARY_FILE"

chmod 600 "$TEMPORARY_FILE"
mv -- "$TEMPORARY_FILE" "$BACKUP_FILE"
find "$BACKUP_DIRECTORY" -maxdepth 1 -type f -name 'mdrift-*.dump' -mtime "+$RETENTION_DAYS" -delete
