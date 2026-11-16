#!/bin/sh
set -e

PORT="${MCP_PORT:-${SSE_PORT:-${PORT:-3002}}}"

# Map legacy MEMOS_URL / MEMOS_API_KEY to MEMO_SERVER_URL / MEMO_API_TOKEN
export MEMO_SERVER_URL="${MEMO_SERVER_URL:-${MEMOS_URL}}"
export MEMO_API_TOKEN="${MEMO_API_TOKEN:-${MEMOS_API_KEY}}"
export MCP_TRANSPORT=http
export PORT="${PORT}"

echo "Starting Memos MCP Server (andreroggeri/memo-mcp) on 0.0.0.0:${PORT}/mcp..."
exec node dist/index.js
