#!/bin/sh
set -e

export MCP_TRANSPORT="${MCP_TRANSPORT:-streamable-http}"
export MCP_HOST="${MCP_HOST:-0.0.0.0}"
export MCP_PORT="${MCP_PORT:-6060}"
export OUTLINE_API_URL="${OUTLINE_API_URL:-https://app.getoutline.com/api}"

if [ -z "${OUTLINE_API_KEY}" ]; then
  echo "Warning: OUTLINE_API_KEY is not set"
fi

echo "Starting Outline MCP Server (Vortiago/mcp-outline) on ${MCP_HOST}:${MCP_PORT}/mcp..."
exec mcp-outline
