#!/bin/sh
set -e

export SSE_PORT="${SSE_PORT:-3021}"

echo "Starting YouTube Transcript MCP Server (@kimtaeyoon83/mcp-server-youtube-transcript) on 0.0.0.0:${SSE_PORT}/mcp..."
exec node /app/http-server.mjs npx --no-install mcp-server-youtube-transcript
