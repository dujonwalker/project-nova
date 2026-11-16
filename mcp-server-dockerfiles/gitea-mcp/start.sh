#!/bin/bash
set -e

PORT="${MCP_PORT:-${SSE_PORT:-3008}}"

if [ -z "${GITEA_HOST}" ]; then
  echo "Error: GITEA_HOST environment variable is required"
  exit 1
fi

if [ -z "${GITEA_ACCESS_TOKEN}" ]; then
  echo "Error: GITEA_ACCESS_TOKEN environment variable is required"
  exit 1
fi

ARGS=("-t" "http" "-host" "${GITEA_HOST}" "-token" "${GITEA_ACCESS_TOKEN}" "-port" "${PORT}")

if [ "${GITEA_INSECURE}" = "true" ]; then
  ARGS+=("-insecure")
fi

if [ "${DEBUG_MODE}" = "true" ]; then
  ARGS+=("-d")
fi

echo "Starting Gitea MCP Server (Streamable HTTP) on 0.0.0.0:${PORT}/mcp..."
exec /app/gitea-mcp "${ARGS[@]}"
