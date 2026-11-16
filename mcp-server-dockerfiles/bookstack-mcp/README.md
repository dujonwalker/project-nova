# BookStack MCP Server (`bookstack-mcp`)

Uses the official pre-built [`ghcr.io/ttpears/bookstack-mcp:latest`](https://github.com/ttpears/bookstack-mcp) image with native **Streamable HTTP** (`MCP_TRANSPORT=http`) at `/mcp`.

## Endpoints
- **MCP Endpoint**: `http://127.0.0.1:3003/mcp`
- **Healthcheck**: `http://127.0.0.1:3003/health`
- **Target BookStack Instance**: `http://127.0.0.1:8080` (`the configured host`)

## Required Compose environment variables
Configure in the Compose deployments `environment` block (referencing existing environment variables):
```env
BOOKSTACK_TOKEN_ID=[[BOOKSTACK_TOKEN_ID]]
BOOKSTACK_TOKEN_SECRET=[[BOOKSTACK_TOKEN_SECRET]]
```
