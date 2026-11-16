#!/bin/sh
set -e

PORT="${MCP_PORT:-${SSE_PORT:-3014}}"

if [ -z "${PROMETHEUS_URL}" ]; then
  echo "Error: PROMETHEUS_URL environment variable is required"
  exit 1
fi

export PROMETHEUS_MCP_SERVER_TRANSPORT=http
export PROMETHEUS_MCP_BIND_HOST=0.0.0.0
export PROMETHEUS_MCP_BIND_PORT="${PORT}"

echo "Starting Prometheus MCP Server (Streamable HTTP) on 0.0.0.0:${PORT}/mcp..."
exec prometheus-mcp-server
