# Memos MCP Proxy (`memos-mcp`)

Lightweight `nginx:alpine` reverse proxy exposing Memos `26.11.0`'s native **Streamable HTTP** MCP server (`http://127.0.0.1:5230/mcp`) at `http://127.0.0.1:3004/mcp` while injecting `Authorization: Bearer ${MEMOS_API_KEY}` server-side.

## Endpoints
- **MCP Endpoint**: `http://127.0.0.1:3004/mcp`
- **Healthcheck**: `http://127.0.0.1:3004/health`
- **Target Memos Instance**: `http://127.0.0.1:5230` (`the configured host`)

## Required Compose environment variables
Configure in the Compose deployments `environment` block (referencing existing environment variables):
```env
MEMOS_API_KEY=[[MEMOS_API_KEY]]
```
> **Note**: Memos `26.10+` requires a Personal Access Token (`memos_pat_...` created in Settings → Access Tokens) for `MEMOS_API_KEY`.
