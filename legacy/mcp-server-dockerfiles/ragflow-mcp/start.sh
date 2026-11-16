#!/bin/sh
set -e

export MCP_SSE_PORT="${MCP_SSE_PORT:-${SSE_PORT:-3015}}"

if [ -z "${RAGFLOW_URL}" ] || [ -z "${RAGFLOW_API_KEY}" ]; then
  echo "Error: RAGFLOW_URL and RAGFLOW_API_KEY are required"
  exit 1
fi

echo "Starting RAGFlow MCP Server (Streamable HTTP) on 0.0.0.0:${MCP_SSE_PORT}/mcp..."
exec python3 /app/http_server.py
