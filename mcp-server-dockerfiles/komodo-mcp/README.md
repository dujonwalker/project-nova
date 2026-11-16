# Komodo MCP Server (`komodo-mcp`)

Custom image built via Docker build from [`MP-Tool/komodo-mcp-server`](https://github.com/MP-Tool/komodo-mcp-server) (`1.5.0`, `komodo_client ^2.3.1`) running stateless **Streamable HTTP** (`MCP_TRANSPORT=http`, `MCP_STATELESS=true`, `MCP_BASE_URL=http://127.0.0.1:3019`) targeting Komodo Core (`http://127.0.0.1:9120`).

- [`open-writes.patch`](./open-writes.patch) adds an explicit `KOMODO_MCP_ALLOW_OPEN_WRITES=true` opt-in so open LAN HTTP (`MCP_AUTH_ENABLED=false`) exposes all `88` tools across all `20` categories (`komodo:read`, `komodo:operate`, `komodo:admin`) using the shared Komodo API key rather than locking HTTP to read-only.
- `MCP_CONFIRM_FALLBACK=allow` allows destructive actions (`delete`, `destroy`, `prune`, `komodo_exec`, `procedure`/`action`/`resource_sync`) to execute when stateless clients have no interactive elicitation channel.
- Central tool-result secret redaction (`MCP_SECRET_SCRUB_ENABLED=true`) remains enabled.

## Endpoints
- **MCP Endpoint**: `http://127.0.0.1:3019/mcp`
- **Readiness Endpoint**: `http://127.0.0.1:3019/ready` (returns `200` when ready)
- **Target Komodo Core**: `http://127.0.0.1:9120`

## Required Compose environment variables
Configure in the Compose deployments `environment` block (referencing existing environment variables):
```env
KOMODO_API_KEY=[[KOMODO_CLI_KEY]]
KOMODO_API_SECRET=[[KOMODO_CLI_SECRET]]
```

## Build & Deployment
- **Docker build**: Builds the included Komodo MCP image for the configured platform.
- **Compose deployments**: `komodo-mcp` on `mcp` (`127.0.0.1:3019`, `file_paths: ["komodo-mcp/docker-compose.yml"]`)
- **Tool surface tuning**: Use `KOMODO_MCP_ALLOW_OPEN_WRITES=false` to revert to read-only, or `MCP_TOOLS_EXCLUDED_TOOLS` / `MCP_TOOLS_EXCLUDED_CATEGORIES` to prune specific tools (e.g. `komodo_exec`).
