FROM node:26.12.1-slim@sha256:36793bcbb160a6a16cede1e62b93f84e26b78a972a8a4c0b879c1c12f22761ec AS dependencies

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install --immutable

FROM node:26.12.1-slim@sha256:36793bcbb160a6a16cede1e62b93f84e26b78a972a8a4c0b879c1c12f22761ec AS builder

WORKDIR /app
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_TELEMETRY_DISABLED=1 \
    NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

RUN corepack enable

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN yarn build && yarn build:workers

FROM node:26.12.1-slim@sha256:36793bcbb160a6a16cede1e62b93f84e26b78a972a8a4c0b879c1c12f22761ec AS runner

WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000

COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/.next/workers ./workers
COPY --from=builder --chown=node:node /app/infra/postgres/migrations ./migrations
COPY --from=builder --chown=node:node /app/compose.production.yml ./deployment/compose.production.yml
COPY --from=builder --chown=node:node /app/infra/nginx ./deployment/infra/nginx
COPY --from=builder --chown=node:node /app/infra/postgres ./deployment/infra/postgres
COPY --from=builder --chown=node:node /app/infra/server ./deployment/infra/server
COPY --from=builder --chown=node:node /app/infra/systemd ./deployment/infra/systemd
COPY --from=builder --chown=node:node /app/infra/README.md ./deployment/infra/README.md

RUN mkdir -p .next/cache && chown -R node:node .next

USER node
EXPOSE 3000
STOPSIGNAL SIGTERM
CMD ["node", "server.js"]
