#!/usr/bin/env bash

set -Eeuo pipefail

if [[ ! "$POSTGRES_USER" =~ ^[a-zA-Z_][a-zA-Z0-9_]*$ ]]; then
  exit 1
fi

if [[ ! "$POSTGRES_DB" =~ ^[a-zA-Z_][a-zA-Z0-9_]*$ ]]; then
  exit 1
fi

if [[ ! "$APP_DATABASE_USER" =~ ^[a-zA-Z_][a-zA-Z0-9_]*$ || ${#APP_DATABASE_PASSWORD} -lt 16 ]]; then
  exit 1
fi

psql \
  --set ON_ERROR_STOP=1 \
  --username "$POSTGRES_USER" \
  --dbname "$POSTGRES_DB" \
  --set admin_user="$POSTGRES_USER" \
  --set database_name="$POSTGRES_DB" \
  --set app_user="$APP_DATABASE_USER" \
  --set app_password="$APP_DATABASE_PASSWORD" <<'SQL'
SELECT format('CREATE ROLE %I LOGIN PASSWORD %L', :'app_user', :'app_password')
WHERE NOT EXISTS (
  SELECT 1 FROM pg_roles WHERE rolname = :'app_user'
) \gexec

GRANT CONNECT ON DATABASE :"database_name" TO :"app_user";
GRANT USAGE ON SCHEMA public TO :"app_user";
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO :"app_user";
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO :"app_user";

ALTER DEFAULT PRIVILEGES FOR ROLE :"admin_user" IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO :"app_user";
ALTER DEFAULT PRIVILEGES FOR ROLE :"admin_user" IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO :"app_user";
SQL
