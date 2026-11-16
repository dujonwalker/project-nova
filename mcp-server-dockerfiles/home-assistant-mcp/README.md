# Home Assistant MCP Server (`home-assistant-mcp`)

Uses the official pre-built [`ghcr.io/homeassistant-ai/ha-mcp:9.2.0`](https://github.com/homeassistant-ai/ha-mcp) image (`ha-mcp-web`) running native **Streamable HTTP** at `/mcp`.

## Endpoints
- **MCP Endpoint**: `http://127.0.0.1:3011/mcp`
- **Healthcheck**: `http://127.0.0.1:3011/healthz` (`MCP_HEALTHZ=true`)
- **Target Home Assistant Instance**: `http://127.0.0.1:8123` (`home-assistant`)

## Required Compose environment variables
Configure in the Compose deployments `environment` block (referencing existing environment variables):
```env
HOMEASSISTANT_TOKEN=[[HA_TOKEN]]
```
