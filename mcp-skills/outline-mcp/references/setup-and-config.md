# Setup & Configuration (`outline-mcp`)

## Package, Server & Endpoints

- **Package / CLI**: `mcp-outline` (`uvx mcp-outline` or Python `mcp_outline.server:main`)
- **HTTP health probes**: `GET /health` and `GET /ready`
- **HTTP transports**: `streamable-http` (`/mcp`) and `sse` (`/sse`)

## Environment Variables

| Variable | Default | Notes |
| :--- | :--- | :--- |
| `OUTLINE_API_KEY` | *(optional in HTTP mode)* | Outline API key (`Settings > API`). In HTTP mode, clients can supply per-request `x-outline-api-key` headers instead |
| `OUTLINE_API_URL` | Outline Cloud | Self-hosted API base URL ending in `/api` (e.g. `https://outline.example.com/api`) |
| `OUTLINE_VERIFY_SSL` | `true` | Set `false` for self-signed TLS certificates |
| `OUTLINE_WRITE_TIMEOUT` | `30.0` | Timeout (seconds) for write API calls |
| `OUTLINE_READ_ONLY` | `false` | Disables all create/update/move/archive/delete tools (takes precedence over `OUTLINE_DISABLE_DELETE`) |
| `OUTLINE_DISABLE_DELETE` | `false` | Disables `delete_document`, `delete_collection`, and `batch_delete_documents` |
| `OUTLINE_DISABLE_RECENT_DOCUMENTS` | `false` | Hides `list_recently_updated_documents` |
| `OUTLINE_DISABLE_AI_TOOLS` | `false` | Disables `ask_ai_about_documents` (useful when Outline has no OpenAI key) |
| `OUTLINE_DYNAMIC_TOOL_LIST` | `false` | Enables per-user `tools/list` filtering based on Outline user role (`viewer`/`member`/`admin`) and API key scopes |
| `MCP_TRANSPORT` | `stdio` | `stdio`, `sse`, or `streamable-http` |
| `MCP_HOST` | `127.0.0.1` | Set `0.0.0.0` inside Docker containers |
| `MCP_PORT` | `3000` | Listen port for `sse` and `streamable-http` |

## Client Configuration Examples

### Streamable HTTP Container

```json
{
  "mcpServers": {
    "outline-mcp": {
      "url": "http://<host>:3000/mcp"
    }
  }
}
```

### Multi-User HTTP Mode (Per-Client API Key)

When `OUTLINE_API_KEY` is omitted on the HTTP server, pass `x-outline-api-key` per client:

```json
{
  "mcpServers": {
    "outline-mcp": {
      "url": "http://<host>:3000/mcp",
      "headers": {
        "x-outline-api-key": "${OUTLINE_API_KEY}"
      }
    }
  }
}
```

### Local stdio (`uvx`)

```json
{
  "mcpServers": {
    "outline-mcp": {
      "command": "uvx",
      "args": ["mcp-outline"],
      "env": {
        "OUTLINE_API_URL": "https://outline.example.com/api",
        "OUTLINE_API_KEY": "YOUR_OUTLINE_API_KEY"
      }
    }
  }
}
```
