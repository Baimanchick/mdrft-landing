FROM node:26.12.0-slim@sha256:0d1e33586362bb9e608c4e751e7a9e7edb55c9ac11461ed5666af696cc461dd4 AS dependencies

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install --immutable

FROM node:26.12.0-slim@sha256:0d1e33586362bb9e608c4e751e7a9e7edb55c9ac11461ed5666af696cc461dd4 AS builder

WORKDIR /app
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_TELEMETRY_DISABLED=1 \
    NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

RUN corepack enable

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN yarn build && yarn build:workers

FROM node:26.12.0-slim@sha256:0d1e33586362bb9e608c4e751e7a9e7edb55c9ac11461ed5666af696cc461dd4 AS runner

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
