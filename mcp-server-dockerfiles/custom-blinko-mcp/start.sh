#!/bin/bash
set -e

if [ -z "${BLINKO_DOMAIN}" ]; then
  echo "Error: BLINKO_DOMAIN environment variable is required"
  exit 1
fi

if [ -z "${BLINKO_API_KEY}" ]; then
  echo "Error: BLINKO_API_KEY environment variable is required"
  exit 1
fi

export SSE_PORT="${SSE_PORT:-8442}"
echo "Starting Custom Blinko MCP Server on 0.0.0.0:${SSE_PORT}/mcp..."
exec node /app/simple-server.js
