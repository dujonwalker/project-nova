#!/bin/sh
set -e

export SSE_PORT="${SSE_PORT:-3017}"
export REAPER_PROJECTS_DIR="${REAPER_PROJECTS_DIR:-/reaper_projects}"

if [ ! -d "${REAPER_PROJECTS_DIR}" ]; then
  mkdir -p "${REAPER_PROJECTS_DIR}"
fi

echo "Starting REAPER QA MCP Server (dschuler36/reaper-mcp-server) on 0.0.0.0:${SSE_PORT}/mcp..."
exec python3 /app/http_server.py
