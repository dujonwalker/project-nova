# Paperless-NGX MCP Server (`paperless-mcp`)

Uses [`@retiform/paperless-mcp`](https://github.com/retiform-labs/paperless-mcp) (`v2.3.6`) running native stateless **Streamable HTTP** (`--http --no-auth`) at `/mcp`. The included Compose configuration builds the image locally.

## Endpoints
- **MCP Endpoint**: `http://127.0.0.1:3001/mcp`
- **Target Paperless-NGX Instance**: `http://127.0.0.1:8000` (`the configured host`)

## Required Compose environment variables
Configure in the Compose deployments `environment` block (referencing existing environment variables):
```env
PAPERLESS_API_KEY=[[PPLS_TOKEN]]
```
