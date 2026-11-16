# Forgejo MCP Server (`forgejo-mcp`)

Uses the official pre-built [`git.b4mad.industries/agentic-forges/forgejo-mcp:latest`](https://git.b4mad.industries/agentic-forges/forgejo-mcp) image running native **Streamable HTTP** transport (`--transport http`).

## Endpoints
- **MCP Endpoint**: `http://127.0.0.1:8989/mcp`
- **Target Forgejo Instance**: `http://127.0.0.1:3000` (`the configured host`)

## Required Compose environment variables
Configure in the Compose deployments `environment` block (referencing existing environment variables):
```env
FORGEJO_ACCESS_TOKEN=[[FORGEJO_TOKEN]]
```
