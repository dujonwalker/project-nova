# Karakeep MCP Server (`karakeep-mcp`)

Wraps the official [`@karakeep/mcp`](https://github.com/karakeep-app/karakeep/tree/main/apps/mcp) (`v0.34.0`) stdio server with a native `@modelcontextprotocol/sdk` `StreamableHTTPServerTransport` HTTP host at `/mcp` and `/health`. The included Compose configuration builds the image locally.

## Endpoints
- **MCP Endpoint**: `http://127.0.0.1:3002/mcp`
- **Healthcheck**: `http://127.0.0.1:3002/health`
- **Target Karakeep Instance**: `http://127.0.0.1:3000` (`the configured host`)

## Required Compose environment variables
Configure in the Compose deployments `environment` block (referencing existing environment variables):
```env
KARAKEEP_API_KEY=[[KARAKEEP_API_KEY]]
```
