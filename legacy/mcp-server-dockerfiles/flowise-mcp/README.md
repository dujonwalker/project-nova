# Flowise MCP Server (Streamable HTTP)

Powered by [matthewhand/mcp-flowise](https://github.com/matthewhand/mcp-flowise) running native Python `StreamableHTTPSessionManager` at `/mcp`.

## Endpoint
- **MCP Endpoint**: `http://<HOST_IP>:3011/mcp`
- **Healthcheck**: `http://<HOST_IP>:3011/health`
- Pure Python runtime — no Node.js, no `uvx` runtime git clone on every boot, and no third-party proxy gateways
