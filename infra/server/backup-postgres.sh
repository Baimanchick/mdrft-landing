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
S3_ENDPOINT="${S3_BACKUP_ENDPOINT:-}"
S3_REGION="${S3_BACKUP_REGION:-}"
S3_BUCKET="${S3_BACKUP_BUCKET:-}"
S3_PREFIX="${S3_BACKUP_PREFIX:-postgres}"

if [[ -z "$BACKUP_DIRECTORY" || "$BACKUP_DIRECTORY" == "/" || ! "$RETENTION_DAYS" =~ ^[1-9][0-9]*$ ]]; then
  printf '%s\n' "Backup configuration is invalid" >&2
  exit 1
fi

if [[ ! "$S3_ENDPOINT" =~ ^https://[^[:space:]]+$ ||
      ! "$S3_REGION" =~ ^[a-z0-9-]+$ ||
      ! "$S3_BUCKET" =~ ^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$ ||
      ! "$S3_PREFIX" =~ ^[a-zA-Z0-9._/-]+$ ||
      "$S3_PREFIX" == /* ||
      "$S3_PREFIX" == *".."* ||
      -z "${AWS_ACCESS_KEY_ID:-}" ||
      -z "${AWS_SECRET_ACCESS_KEY:-}" ]]; then
  printf '%s\n' "S3 backup configuration is invalid" >&2
  exit 1
fi

if ! command -v aws >/dev/null 2>&1; then
  printf '%s\n' "AWS CLI is required for S3 backups" >&2
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

S3_OBJECT_KEY="${S3_PREFIX%/}/$(basename -- "$BACKUP_FILE")"
AWS_EC2_METADATA_DISABLED=true AWS_PAGER="" aws s3api put-object \
  --endpoint-url "$S3_ENDPOINT" \
  --region "$S3_REGION" \
  --bucket "$S3_BUCKET" \
  --key "$S3_OBJECT_KEY" \
  --body "$BACKUP_FILE" \
  --if-none-match "*" \
  --no-cli-pager >/dev/null

find "$BACKUP_DIRECTORY" -maxdepth 1 -type f -name 'mdrift-*.dump' -mtime "+$RETENTION_DAYS" -delete
