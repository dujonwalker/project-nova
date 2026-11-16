#!/bin/sh
set -e

HOST="${SSE_HOST:-0.0.0.0}"
PORT="${MCP_PORT:-${SSE_PORT:-3007}}"

echo "Starting Playwright MCP Server (@playwright/mcp) on ${HOST}:${PORT}/mcp..."
exec npx --no-install @playwright/mcp \
  --headless \
  --browser chromium \
  --no-sandbox \
  --host "${HOST}" \
  --port "${PORT}" \
  --allowed-hosts "*"
