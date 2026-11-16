#!/bin/sh
set -e

PORT="${MCP_PORT:-${SSE_PORT:-3001}}"
export PAPERLESS_URL="${PAPERLESS_URL}"
export PAPERLESS_API_KEY="${PAPERLESS_API_KEY:-${PAPERLESS_TOKEN}}"

if [ -z "${PAPERLESS_URL}" ] || [ -z "${PAPERLESS_API_KEY}" ]; then
  echo "Error: PAPERLESS_URL and PAPERLESS_API_KEY (or PAPERLESS_TOKEN) are required"
  exit 1
fi

echo "Starting Paperless-NGX MCP Server (@retiform/paperless-mcp) on 0.0.0.0:${PORT}/mcp..."
exec /app/node_modules/.bin/paperless-mcp --http --no-auth --port "${PORT}" --baseUrl "${PAPERLESS_URL}" --token "${PAPERLESS_API_KEY}"
