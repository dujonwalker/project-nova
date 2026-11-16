# Setup & Configuration (`triliumnext-mcp`)

## Transports & HTTP Endpoints

- **Package / Binary**: `triliumnext-mcp` (`node dist/index.js`, Node `>=20`)
- **`stdio`** *(default)*: `--transport stdio` (or `TRILIUM_TRANSPORT=stdio`)
- **`http`** *(Streamable HTTP + legacy SSE)*: `--transport http` (`TRILIUM_TRANSPORT=http`, default port `3000` via `-p`/`--port` or `TRILIUM_HTTP_PORT`):
  - `POST/GET/DELETE /mcp` — Streamable HTTP MCP endpoint
  - `GET /sse` (+ `POST /messages`) — legacy SSE endpoint
  - `GET /health` — unauthenticated container liveness endpoint
  - `GET /metrics` — opt-in Prometheus metrics (`--metrics` / `TRILIUM_METRICS=true`, gated by `--metrics-auth` `gateway|bearer|none`)

## Key Environment Variables & CLI Flags

| Env Var | CLI Flag | Default | Notes |
| :--- | :--- | :--- | :--- |
| `TRILIUM_URL` | `-u, --url` | `http://localhost:37740` | Base or ETAPI URL (`/etapi` appended automatically if missing). Disallowed in `--multi-tenant` |
| `TRILIUM_TOKEN` | `-t, --token` | *(required in single-tenant)* | ETAPI token. Disallowed in `--multi-tenant` |
| `TRILIUM_PUBLIC_URL` | `--public-url` | Derived from `TRILIUM_URL` | User-facing web URL for clickable note `url` links returned by tools |
| `TRILIUM_TRANSPORT` | `--transport` | `stdio` | `stdio` or `http` |
| `TRILIUM_HTTP_PORT` | `-p, --port` | `3000` | HTTP listen port |
| `TRILIUM_MULTI_TENANT` | `--multi-tenant` | `false` | Requires `http`; clients supply `X-Trilium-Url` + `X-Trilium-Token` headers per connection |
| `TRILIUM_GATEWAY_AUTH` | `--gateway-auth` | `none` (`bearer` if multi-tenant) | `none`, `bearer`, or `jwt` (`--gateway-token`, `--jwt-secret`, `--jwt-jwks-url`) |
| `TRILIUM_URL_ALLOWLIST` | `--trilium-url-allowlist` | *(empty)* | Allowed hostnames for multi-tenant `X-Trilium-Url` |
| `TRILIUM_ALLOW_PRIVATE_URLS` | `--allow-private-urls` | `false` | Permits private/loopback URLs in multi-tenant mode & remote content fetches (blocked by SSRF guard by default) |
| `TRILIUM_ALLOW_LOCAL_FILE_READ` | `--allow-local-file-read` / `--no-local-file-read` | `true` (stdio) / `false` (http) | Controls local file paths in `create_note` / attachment tools; confine with `TRILIUM_LOCAL_FILE_ROOTS` |
| `TRILIUM_REQUEST_TIMEOUT` | `--request-timeout` | `60s` | Per-request ETAPI timeout (`export`/`import`/`backup` get `5x`) |
| `TRILIUM_BUSY_COOLDOWN` | `--busy-cooldown` | `30s` | `TRILIUM_BUSY` cooldown window after an ETAPI timeout |
| `TRILIUM_SEARCH_STRATEGY` | `--search-strategy` | `auto` | Default `search_notes` strategy (`auto`, `fast`, `full`) |

## Client Configuration Examples

### Single-Tenant Streamable HTTP Container

```json
{
  "mcpServers": {
    "triliumnext-mcp": {
      "url": "http://<host>:3000/mcp"
    }
  }
}
```

### Multi-Tenant HTTP Gateway

Start with `TRILIUM_TRANSPORT=http`, `TRILIUM_MULTI_TENANT=true` (and omit startup `TRILIUM_URL`/`TRILIUM_TOKEN`):

```json
{
  "mcpServers": {
    "triliumnext-mcp": {
      "url": "http://<host>:3000/mcp",
      "headers": {
        "Authorization": "Bearer ${GATEWAY_TOKEN}",
        "X-Trilium-Url": "https://notes.example.com",
        "X-Trilium-Token": "${TRILIUM_TOKEN}"
      }
    }
  }
}
```
