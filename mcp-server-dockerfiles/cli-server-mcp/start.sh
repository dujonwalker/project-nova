#!/bin/bash
set -e

export SSE_PORT="${SSE_PORT:-3009}"
export ALLOWED_DIR="${ALLOWED_DIR:-/data}"
export ALLOWED_COMMANDS="${ALLOWED_COMMANDS:-all}"
export ALLOWED_FLAGS="${ALLOWED_FLAGS:-all}"
export MAX_COMMAND_LENGTH="${MAX_COMMAND_LENGTH:-4096}"
export COMMAND_TIMEOUT="${COMMAND_TIMEOUT:-60}"
export ALLOW_SHELL_OPERATORS="${ALLOW_SHELL_OPERATORS:-true}"

mkdir -p "${ALLOWED_DIR}"

echo "Starting CLI MCP Server (Streamable HTTP) on 0.0.0.0:${SSE_PORT}/mcp..."
exec /app/venv/bin/python /app/http_server.py
