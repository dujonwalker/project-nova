# `komodo-mcp` Setup & Configuration

Upstream repository: [`MP-Tool/komodo-mcp-server`](https://github.com/MP-Tool/komodo-mcp-server) (`v1.5.0`, GPL-3.0, Node `>=22.0.0`, `komodo_client ^2.3.1`, `mcp-server-framework ^1.2.0`).

## Transports & Health Probes

- **Transports (`MCP_TRANSPORT`):** Stateful Streamable HTTP (`/mcp`, default in Docker), HTTPS with TLS, legacy SSE (`/sse`), and `stdio`.
- **Health probes:** `GET /health` and `GET /ready` (`200` ready, `503` Komodo disconnected, `429` overloaded).

## Two Authentication Layers

1. **MCP Server → Komodo Core:**
   - Required: `KOMODO_URL` (e.g. `https://komodo.example.com:9120`).
   - Credentials (one of): `KOMODO_API_KEY` + `KOMODO_API_SECRET` (recommended), `KOMODO_USERNAME` + `KOMODO_PASSWORD`, or `KOMODO_JWT_TOKEN` (all support `*_FILE` Docker secret variants). Used in `stdio` mode and read-only open HTTP mode.
2. **MCP Clients → MCP Server (`MCP_AUTH_ENABLED`):**
   - **Default (`true`) on HTTP/HTTPS:** Clients authenticate via OAuth local login against Komodo username/password; each session runs with that user's own Komodo permissions and scoped capabilities (`scopeFilterCapabilities: true`).
   - **Disabled (`MCP_AUTH_ENABLED=false`) on HTTP/HTTPS:** Enforces a strict **read-only invariant** (`komodo:read` only; all write/operate/admin/exec tools are hidden and rejected).

## Key Environment Variables

Config precedence: `Environment Variables > Config File (config.toml/yaml/json) > .env > Defaults`.

| Variable | Default | Description |
| :--- | :--- | :--- |
| `KOMODO_API_TIMEOUT_MS` | `30s` | Komodo Core API request timeout (duration string or ms) |
| `MCP_CONFIRM_DESTRUCTIVE` | `true` | Require MCP elicitation confirmation for destructive tools (`"true"` enables) |
| `MCP_CONFIRM_FALLBACK` | `deny` | Behavior if client lacks elicitation (`deny` or `allow`) |
| `MCP_CONFIRM_TIMEOUT_MS` | `5m` | Timeout waiting for confirmation prompt |
| `MCP_SECRET_SCRUB_ENABLED` | framework default (on) | Tri-state override for central secret redaction (`"true"` enables) |
| `MCP_SECRET_SCRUB_KEYS` | unset | Extra case-insensitive key-name fragments to redact |
| `MCP_SECRET_SCRUB_ALLOW_KEYS` | unset | Exact key names excluded from key-based redaction |
| `MCP_TOOLS_ALLOWED_CATEGORIES` | unset (all) | Comma-separated category allowlist |
| `MCP_TOOLS_EXCLUDED_CATEGORIES` | unset | Comma-separated categories to drop |
| `MCP_TOOLS_EXCLUDED_TOOLS` | unset | Comma-separated tool names to drop (e.g. `komodo_exec`) |
| `MCP_RESOURCE_TTL_INFO` / `LOGS` | `15m` / `2m` | Ephemeral resource TTLs |
| `MCP_RESOURCE_MAX_ENTRIES` | `1000` | Maximum in-memory `ephemeral://` entries |
