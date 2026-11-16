# Gitea MCP Server (`gitea-mcp`)

Uses the official pre-built [`docker.gitea.com/gitea-mcp-server:latest`](https://gitea.com/gitea/gitea-mcp) image running native **Streamable HTTP** transport (`-t http`).

## Endpoints
- **MCP Endpoint**: `http://127.0.0.1:3008/mcp`
- **Healthcheck**: `http://127.0.0.1:3008/healthz` (plus built-in `/app/gitea-mcp -healthcheck`)
- **Target Gitea Instance**: Set `GITEA_HOST` to your own Gitea URL.

## Required Compose environment variables
Configure in the Compose deployments `environment` block (referencing existing environment variables):
```env
GITEA_ACCESS_TOKEN=[[GITEA_TOKEN]]
```
