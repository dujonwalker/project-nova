#!/bin/bash
set -e

PORT="${MCP_PORT:-${SSE_PORT:-${DOCSPACE_PORT:-3001}}}"

if [ -z "${DOCSPACE_BASE_URL}" ]; then
  echo "Error: DOCSPACE_BASE_URL is required"
  exit 1
fi

export DOCSPACE_TRANSPORT=streamable-http
export DOCSPACE_HOST=0.0.0.0
export DOCSPACE_PORT="${PORT}"

echo "Starting ONLYOFFICE DocSpace MCP Server (Streamable HTTP) on 0.0.0.0:${PORT}/mcp..."
exec npx --no-install onlyoffice-docspace-mcp
