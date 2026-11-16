#!/bin/sh
set -e

PORT="${MCP_HTTP_PORT:-${PORT:-${SSE_PORT:-3003}}}"

# Map legacy yellowgg2/mcp-bookstack env vars to ttpears/bookstack-mcp env vars
if [ -z "${BOOKSTACK_BASE_URL}" ] && [ -n "${BOOKSTACK_API_URL}" ]; then
  BOOKSTACK_BASE_URL=$(echo "${BOOKSTACK_API_URL}" | sed 's|/api/*$||')
  export BOOKSTACK_BASE_URL
fi

if [ -z "${BOOKSTACK_TOKEN_ID}" ] && [ -n "${BOOKSTACK_API_KEY}" ]; then
  export BOOKSTACK_TOKEN_ID="${BOOKSTACK_API_KEY}"
fi

if [ -z "${BOOKSTACK_TOKEN_SECRET}" ] && [ -n "${BOOKSTACK_API_TOKEN}" ]; then
  export BOOKSTACK_TOKEN_SECRET="${BOOKSTACK_API_TOKEN}"
fi

export BOOKSTACK_ENABLE_WRITE="${BOOKSTACK_ENABLE_WRITE:-true}"
export MCP_TRANSPORT=http
export MCP_HTTP_HOST="${HOST:-0.0.0.0}"
export MCP_HTTP_PORT="${PORT}"
export MCP_HTTP_PATH="${MCP_HTTP_PATH:-/mcp}"

echo "Starting BookStack MCP Server (ttpears/bookstack-mcp) on ${MCP_HTTP_HOST}:${MCP_HTTP_PORT}${MCP_HTTP_PATH}..."
exec node dist/index.js
