#!/bin/sh
set -e

export SSE_PORT="${SSE_PORT:-3016}"
export MCP_PORT="${SSE_PORT}"

echo "Starting REAPER MCP Server (xDarkzx/Reaper-MCP) on 0.0.0.0:${SSE_PORT}/mcp..."
exec python3 /app/http_server.py
