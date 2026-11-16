# Prometheus MCP Server (`prometheus-mcp`)

Uses the official pre-built [`ghcr.io/pab1it0/prometheus-mcp-server:1.6.2`](https://github.com/pab1it0/prometheus-mcp-server) image running native FastMCP **Streamable HTTP** (`PROMETHEUS_MCP_SERVER_TRANSPORT=http`) at `/mcp`.

## Endpoints
- **MCP Endpoint**: `http://127.0.0.1:3014/mcp`
- **Healthcheck**: `http://127.0.0.1:3014/health`
- **Target Prometheus Instance**: `http://127.0.0.1:9090` (`the configured host`)

## Optional Compose environment variables
No credentials are required for the unauthenticated LAN Prometheus instance on `the configured host`. Optional overrides can be configured in Compose deployments `environment`:
```env
PROMETHEUS_URL=http://127.0.0.1:9090
SSE_PORT=3014
PROMETHEUS_MCP_STATELESS_HTTP=true
```
