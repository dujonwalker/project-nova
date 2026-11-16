#!/bin/sh
set -e

export SSE_PORT="${SSE_PORT:-3011}"
export FLOWISE_SIMPLE_MODE="${FLOWISE_SIMPLE_MODE:-false}"

if [ -z "${FLOWISE_API_ENDPOINT}" ]; then
  echo "Error: FLOWISE_API_ENDPOINT is required"
  exit 1
fi

echo "Starting Flowise MCP Server (matthewhand/mcp-flowise, simple_mode=${FLOWISE_SIMPLE_MODE}) on 0.0.0.0:${SSE_PORT}/mcp..."
exec python3 /app/http_server.py
