#!/bin/sh
set -e

PORT="${MCP_PORT:-${SSE_PORT:-3001}}"
export LANGFUSE_HOST="${LANGFUSE_HOST:-${LANGFUSE_BASEURL:-https://cloud.langfuse.com}}"
export LANGFUSE_MCP_TRANSPORT=streamable-http
export LANGFUSE_MCP_BIND_HOST=0.0.0.0
export LANGFUSE_MCP_PORT="${PORT}"

echo "Starting Langfuse MCP Server (avivsinai/langfuse-mcp) on 0.0.0.0:${PORT}/mcp..."
exec python -m langfuse_mcp \
  --transport streamable-http \
  --bind-host 0.0.0.0 \
  --port "${PORT}" \
  --host "${LANGFUSE_HOST}"
