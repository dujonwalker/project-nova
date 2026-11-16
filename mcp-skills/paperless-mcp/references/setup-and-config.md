# Setup & Configuration (`paperless-mcp`)

## Server Package & Image

- **npm / npx**: `@retiform/paperless-mcp`
- **Container image**: `ghcr.io/retiform-labs/paperless-mcp:latest`
- **Endpoints (HTTP mode)**: `/mcp` (Streamable HTTP) and `/health`

## CLI Flags & Environment Variables

| Option / Env Var | Default | Notes |
| :--- | :--- | :--- |
| `PAPERLESS_URL` / `--baseUrl` | *(required)* | Base URL of Paperless-ngx (e.g. `http://paperless:8000`) |
| `PAPERLESS_API_KEY` / `--token` | *(required in stdio)* | Paperless API token; optional in `--http` mode if clients pass `Authorization: Bearer <token>` |
| `PAPERLESS_PUBLIC_URL` / `--publicUrl` | `PAPERLESS_URL` | Optional public URL prefix for links/metadata |
| `PAPERLESS_API_VERSION` | `9` | Accept header API version; required (`9`) for Paperless-ngx v3.0.0+. Lower for older instances if HTTP `406` occurs |
| `PAPERLESS_MCP_UPLOAD_PATHS` | *(unset = allow all)* | Colon-separated allowlist of directories for `post_document` `file_path` uploads |
| `PAPERLESS_MCP_MAX_INLINE_CHARS` | `50000` | Maximum `max_chars` accepted by `get_document_content` |
| `--http` | `false` | Enables Streamable HTTP server instead of stdio |
| `--port` | `3000` | Listen port in `--http` mode |
| `--no-auth` | `false` | Allows unauthenticated local MCP clients to use server `PAPERLESS_API_KEY` |

## Transport Modes

### 1. Local stdio (Client spawns MCP server)

```json
{
  "mcpServers": {
    "paperless-mcp": {
      "command": "npx",
      "args": ["-y", "@retiform/paperless-mcp@latest"],
      "env": {
        "PAPERLESS_URL": "http://localhost:8000",
        "PAPERLESS_API_KEY": "YOUR_PAPERLESS_API_TOKEN"
      }
    }
  }
}
```

### 2. Streamable HTTP Container (`--http`)

When running `--http`, incoming client requests **must** send `Authorization: Bearer <paperless-token>` (unauthenticated requests receive HTTP `401` even when `PAPERLESS_API_KEY` is configured on the server) **unless** you explicitly pass `--no-auth` on a trusted private network:

```json
{
  "mcpServers": {
    "paperless-mcp": {
      "serverUrl": "http://<host>:3000/mcp"
    }
  }
}
```

Or with per-client Bearer auth (omit `--no-auth` on the server):

```json
{
  "mcpServers": {
    "paperless-mcp": {
      "serverUrl": "http://<host>:3000/mcp",
      "headers": {
        "Authorization": "Bearer ${PAPERLESS_API_KEY}"
      }
    }
  }
}
```

## Common Errors

- **HTTP `401 Unauthorized` in `--http` mode**: Client omitted `Authorization: Bearer <token>` and server was started without `--no-auth`.
- **HTTP `406 Not Acceptable`**: `PAPERLESS_API_VERSION` (`9` by default) is newer than your Paperless-ngx server supports—set `PAPERLESS_API_VERSION` to match your instance.
- **`file_path` upload rejected**: Path falls outside `PAPERLESS_MCP_UPLOAD_PATHS`, or file exceeds 100 MB.
