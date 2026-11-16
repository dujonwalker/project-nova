#!/bin/sh
set -e

# Map legacy SIYUAN_SERVER to SIYUAN_URL expected by xgq18237/siyuan_mcp_server
export SIYUAN_URL="${SIYUAN_URL:-${SIYUAN_SERVER}}"
export SIYUAN_TOKEN="${SIYUAN_TOKEN}"
export SSE_PORT="${SSE_PORT:-3003}"
export SSE_HOST="${SSE_HOST:-0.0.0.0}"

if [ -z "${SIYUAN_URL}" ] || [ -z "${SIYUAN_TOKEN}" ]; then
  echo "Error: SIYUAN_SERVER (or SIYUAN_URL) and SIYUAN_TOKEN are required"
  exit 1
fi

exec node /app/http-server.mjs
