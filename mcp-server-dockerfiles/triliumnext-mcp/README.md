# TriliumNext MCP Server (`triliumnext-mcp`)

Uses the official pre-built [`ghcr.io/perfectra1n/triliumnext-mcp:0.3.2`](https://github.com/perfectra1n/triliumnext-mcp) image running native **Streamable HTTP** (`TRILIUM_TRANSPORT=http`) at `/mcp` (plus legacy `/sse`).

## Endpoints
- **MCP Endpoint (Streamable HTTP)**: `http://127.0.0.1:3005/mcp`
- **Healthcheck**: `http://127.0.0.1:3005/health`
- **Target TriliumNext Instance**: `http://127.0.0.1:8084/etapi` (`the configured host`)

## Required Compose environment variables
Configure in the Compose deployments `environment` block (referencing existing environment variables):
```env
TRILIUM_TOKEN=[[TRILIUM_ETAPI_TOKEN]]
```
