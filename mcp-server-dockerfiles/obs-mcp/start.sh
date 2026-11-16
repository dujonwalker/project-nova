#!/bin/sh
set -e

PORT="${MCP_PORT:-${SSE_PORT:-3012}}"

export MCP_TRANSPORT=http
export MCP_HTTP_HOST=0.0.0.0
export MCP_HTTP_PORT="${PORT}"
export TOOLSETS="${TOOLSETS:-all}"

echo "Starting OBS MCP Server (@firfi/obs-mcp) on 0.0.0.0:${PORT}/mcp..."
exec npx --no-install obs-mcp
