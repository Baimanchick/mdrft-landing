#!/usr/bin/env bash

set -Eeuo pipefail

ORIGINAL_COMMAND="${SSH_ORIGINAL_COMMAND:-}"

if [[ "$ORIGINAL_COMMAND" =~ ^/opt/mdrift/infra/server/deploy\.sh[[:space:]]+(ghcr\.io/baimanchick/mdrft-landing@sha256:[a-f0-9]{64})$ ]]; then
  exec /opt/mdrift/infra/server/deploy.sh "${BASH_REMATCH[1]}"
fi

printf '%s\n' "Only immutable m-drift-school deployments are allowed" >&2
exit 1
