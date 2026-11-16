#!/bin/sh
set -e

export SSE_PORT="${SSE_PORT:-3002}"

if [ -z "${KARAKEEP_API_ADDR}" ] || [ -z "${KARAKEEP_API_KEY}" ]; then
  echo "Error: KARAKEEP_API_ADDR and KARAKEEP_API_KEY are required"
  exit 1
fi

echo "Starting Karakeep MCP Server (@karakeep/mcp) on ${SSE_HOST:-0.0.0.0}:${SSE_PORT}/mcp..."
exec node /app/http-server.mjs node /app/node_modules/@karakeep/mcp/dist/index.js
