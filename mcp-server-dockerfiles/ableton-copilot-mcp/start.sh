#!/bin/sh
set -e

export SSE_PORT="${SSE_PORT:-3013}"
export BASE_PATH="${BASE_PATH:-/data}"
export osc_host="${ABLETON_IP:-127.0.0.1}"

echo "Starting Ableton Copilot MCP Server (Streamable HTTP) on 0.0.0.0:${SSE_PORT}/mcp (Ableton OSC host: ${osc_host})..."
exec node /app/http-server.mjs npx --no-install ableton-copilot-mcp
