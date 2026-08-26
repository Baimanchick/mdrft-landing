# Production infrastructure

This directory contains the production runtime for a single small Selectel VDS. The VDS never builds application code: GitHub Actions builds one immutable image, publishes it to GHCR, and the server runs that image as both Next.js and the Telegram worker.

## Runtime layout

`nginx` is the only container with published ports. Next.js, PostgreSQL, and the worker communicate over private Docker networks. PostgreSQL is not exposed on the host.

The API transaction writes the validated lead and its Telegram outbox record together. The worker claims one record at a time with `FOR UPDATE SKIP LOCKED`. Delivery is at-least-once: if Telegram accepts a message but the worker dies before PostgreSQL records the result, a retry can create a duplicate. Every message contains the stable submission ID so a duplicate is identifiable; losing a paid lead is treated as the worse failure mode.

The configured memory ceilings are 512 MB for PostgreSQL, 512 MB for Next.js, 192 MB for the worker, and 64 MB for Nginx. JSON container logs are rotated at 5 MB with three files per container. Next.js uses its standalone output and a bounded 384 MB V8 heap.

## Before purchasing the VDS

Use a regular supported Linux image with Docker Engine and the Compose plugin. Selectel's prebuilt Containers Ready image currently declares a minimum of two vCPU, so it is not suitable for the planned one-vCPU tariff. The server must be persistent, not preemptible.

Create an A record for the production domain before requesting a certificate. Allow inbound TCP 22 only from trusted administrator addresses and TCP 80/443 from the internet. Do not expose 3000 or 5432. Use a Selectel security group or cloud firewall in addition to the host firewall.

## One-time server bootstrap

1. Create a dedicated deployment user, install Docker Engine and the Compose plugin, and place the deployment files in `/opt/mdrift`:

   - `compose.production.yml`
   - the complete `infra` directory
   - `.env.production`, created from `.env.production.example`

2. Make `/opt/mdrift/.env.production` readable only by the deployment user:

   ```bash
   chmod 600 /opt/mdrift/.env.production
   ```

3. Generate independent random values for `POSTGRES_ADMIN_PASSWORD`, `APP_DATABASE_PASSWORD`, and `LEAD_PROTECTION_HMAC_SECRET`. The application role has data access but no database-owner or schema-creation privileges. Approve a business retention period before setting `LEAD_RETENTION_DAYS`. If Telegram forum topics are used, configure all four topic IDs; otherwise leave all four empty.

4. Authenticate the server to GHCR using a dedicated read-only package token:

   ```bash
   docker login ghcr.io
   ```

5. Put the image with its immutable digest in `APP_IMAGE`, then issue the first certificate and start the stack:

   ```bash
   /opt/mdrift/infra/server/bootstrap-tls.sh
   ```

6. Install certificate-renewal and database-backup timers:

   ```bash
   sudo install -m 0644 /opt/mdrift/infra/systemd/mdrift-certbot-renew.* /etc/systemd/system/
   sudo install -m 0644 /opt/mdrift/infra/systemd/mdrift-postgres-backup.* /etc/systemd/system/
   sudo systemctl daemon-reload
   sudo systemctl enable --now mdrift-certbot-renew.timer mdrift-postgres-backup.timer
   ```

7. Copy PostgreSQL backups to storage outside this VDS. The local seven-day rotation protects against application mistakes but does not protect against loss of the VDS or its disk. Selectel snapshots or an object-storage copy should be configured before accepting real leads.

## GitHub configuration

The workflow publishes `linux/amd64` images to GHCR on each push to `main`. Deployment is disabled until the repository variable `PRODUCTION_DEPLOY_ENABLED` is set to `true`.

Create a protected GitHub environment named `production` and configure these secrets:

- `DEPLOY_HOST`: the server hostname or IP;
- `DEPLOY_USER`: the dedicated deployment user;
- `DEPLOY_SSH_KEY`: a deployment-only Ed25519 private key;
- `DEPLOY_KNOWN_HOSTS`: a previously verified host-key line, not the output of an unverified connection made inside the workflow.

The deployment job passes only `ghcr.io/...@sha256:...` to `/opt/mdrift/infra/server/deploy.sh`. That script pulls the ready image, validates and activates the versioned Compose/Nginx/operations bundle embedded in that image, runs pending migrations, recreates the services, checks application and Nginx health, and rolls application containers and runtime configuration back to the last successful release when health checks fail. It does not run Yarn, Next.js, or Docker builds.

Database migrations must remain backward-compatible with the immediately preceding application image because an application rollback never rewrites PostgreSQL history.

## Operations

Inspect service state and bounded logs:

```bash
cd /opt/mdrift
docker compose --env-file .env.production -f compose.production.yml ps
docker compose --env-file .env.production -f compose.production.yml logs --tail 100 app telegram-worker
```

Inspect pending or failed deliveries without printing lead payloads:

```bash
cd /opt/mdrift
set -a
source .env.production
set +a
docker compose --env-file .env.production -f compose.production.yml exec -T postgres \
  psql --username "$POSTGRES_ADMIN_USER" --dbname "$POSTGRES_DB" \
  --command "SELECT status, count(*) FROM telegram_outbox GROUP BY status ORDER BY status;"
```

Run an on-demand database backup:

```bash
/opt/mdrift/infra/server/backup-postgres.sh
```

After correcting the underlying Telegram configuration or group permissions, explicitly retry one `dead_letter` by the submission ID printed in the Telegram message or found in the database:

```bash
/opt/mdrift/infra/server/retry-dead-letter.sh 00000000-0000-4000-8000-000000000000
```

Restore procedures must be rehearsed on a separate PostgreSQL instance before production. Never test a restore over the live database.

## Data lifecycle

Raw lead payloads contain personal data. The worker deletes terminal leads after `LEAD_RETENTION_DAYS`; associated outbox rows are removed by cascade. Pending and processing records are retained until delivered or moved to `dead_letter`. Rate-limit rows store only HMAC digests of client IPs and are cleaned after two days. Application and Nginx logs never include payloads, Telegram messages, tokens, or client IP addresses.
