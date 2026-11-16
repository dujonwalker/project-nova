#!/bin/sh
set -e

PORT="${MCP_PORT:-${SSE_PORT:-3011}}"

# Map legacy HA_URL and HA_TOKEN to HOMEASSISTANT_URL and HOMEASSISTANT_TOKEN
export HOMEASSISTANT_URL="${HOMEASSISTANT_URL:-${HA_URL}}"
export HOMEASSISTANT_TOKEN="${HOMEASSISTANT_TOKEN:-${HA_TOKEN}}"
export MCP_HOST=0.0.0.0
export MCP_PORT="${PORT}"
export MCP_SECRET_PATH=/mcp
export HA_MCP_DISABLE_SETTINGS_UI=true

if [ -z "${HOMEASSISTANT_URL}" ] || [ -z "${HOMEASSISTANT_TOKEN}" ]; then
  echo "Error: HA_URL (or HOMEASSISTANT_URL) and HA_TOKEN (or HOMEASSISTANT_TOKEN) are required"
  exit 1
fi

echo "Starting Home Assistant MCP Server (homeassistant-ai/ha-mcp) on 0.0.0.0:${PORT}/mcp..."
exec ha-mcp-web
