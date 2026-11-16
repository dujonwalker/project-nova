#!/bin/sh
set -e

export SSE_PORT="${SSE_PORT:-3020}"

echo "Starting Fetch MCP Server (Streamable HTTP) on 0.0.0.0:${SSE_PORT}/mcp..."
exec node /app/http-server.mjs node /app/fetch-mcp/dist/index.js
