# Outline MCP Server (`outline-mcp`)

Uses the official pre-built [`ghcr.io/vortiago/mcp-outline:1.11.0`](https://github.com/Vortiago/mcp-outline) image running native **Streamable HTTP** (`MCP_TRANSPORT=streamable-http`) at `/mcp`.

## Endpoints
- **MCP Endpoint**: `http://127.0.0.1:7070/mcp`
- **Healthcheck**: `http://127.0.0.1:7070/health` (liveness), `http://127.0.0.1:7070/ready` (readiness)
- **Target Outline Instance**: `http://127.0.0.1:3000/api` (`outline`)

## Required Compose environment variables
Configure in the Compose deployments `environment` block (referencing existing environment variables):
```env
OUTLINE_API_KEY=[[OUTLINE_API_KEY]]
```
