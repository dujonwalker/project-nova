#!/bin/sh
set -e

PORT="${MCP_PORT:-${SSE_PORT:-3001}}"

export TRILIUM_URL="${TRILIUM_URL:-${TRILIUM_API_URL}}"
export TRILIUM_TOKEN="${TRILIUM_TOKEN:-${TRILIUM_API_TOKEN}}"
export TRILIUM_TRANSPORT=http
export TRILIUM_HTTP_PORT="${PORT}"
export TRILIUM_GATEWAY_AUTH="${TRILIUM_GATEWAY_AUTH:-none}"
export TRILIUM_ALLOW_PRIVATE_URLS=true

if [ -z "${TRILIUM_URL}" ] || [ -z "${TRILIUM_TOKEN}" ]; then
  echo "Error: TRILIUM_API_URL (or TRILIUM_URL) and TRILIUM_API_TOKEN (or TRILIUM_TOKEN) are required"
  exit 1
fi

echo "Starting TriliumNext MCP Server (perfectra1n/triliumnext-mcp) on 0.0.0.0:${PORT}/mcp..."
exec node dist/index.js
