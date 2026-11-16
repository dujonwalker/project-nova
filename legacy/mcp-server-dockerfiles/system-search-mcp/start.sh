#!/bin/bash
set -e

echo "Initializing locate database..."
updatedb || true

export SSE_HOST="${SSE_HOST:-0.0.0.0}"
export SSE_PORT="${SSE_PORT:-3008}"

echo "Starting Everything Search MCP Server (Streamable HTTP) on ${SSE_HOST}:${SSE_PORT}/mcp..."
exec python3 /app/http_server.py
