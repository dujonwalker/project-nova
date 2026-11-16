#!/bin/sh
set -e

PORT="${MCP_PORT:-${SSE_PORT:-8989}}"
FORGEJO_URL="${FORGEJO_URL:-${GITEA_HOST:-https://forgejo.org}}"
FORGEJO_ACCESS_TOKEN="${FORGEJO_ACCESS_TOKEN:-${GITEA_ACCESS_TOKEN}}"

if [ -z "${FORGEJO_ACCESS_TOKEN}" ]; then
  echo "Error: FORGEJO_ACCESS_TOKEN (or GITEA_ACCESS_TOKEN) is required"
  exit 1
fi

echo "Starting Forgejo MCP Server (Streamable HTTP) on 0.0.0.0:${PORT}/mcp..."
exec forgejo-mcp \
  --transport http \
  --host 0.0.0.0 \
  --http-port "${PORT}" \
  --url "${FORGEJO_URL}" \
  --token "${FORGEJO_ACCESS_TOKEN}" \
  --allow-operator-token-fallback
