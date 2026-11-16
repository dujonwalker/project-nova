# Fetcher MCP Setup & Configuration

Configuration reference for `jae-jae/fetcher-mcp` (`v0.4.1`, Node.js + Playwright Chromium).

## CLI Flags

`fetcher-mcp` configures transport via CLI flags (not env vars):

| Flag | Default | Purpose |
|---|---|---|
| `--transport=stdio \| http` | `stdio` | Transport protocol (`stdio` default, `http` enables Express HTTP server) |
| `--host=<addr>` | `localhost` (Docker uses `0.0.0.0`) | Bind host when `--transport=http` |
| `--port=<port>` | `3000` | Listen port when `--transport=http` |
| `--debug` | `false` | Launch Chromium non-headless and keep browser windows open |
| `--log` | `false` | Enable logger output (set in Docker image; avoid under `stdio` if stdout interferes) |

---

## Transports & HTTP Endpoints (`--transport=http`)

Docker CMD default: `node build/index.js --log --transport=http --host=0.0.0.0 --port=3000`.

| Path | Protocol / Purpose |
|---|---|
| `POST /mcp`, `GET /mcp`, `DELETE /mcp` | **Streamable HTTP MCP** (stateful session mode using `mcp-session-id` header generated via `randomUUID()` on `initialize`; subsequent calls must pass `mcp-session-id`) |
| `GET /sse`, `POST /messages` | Legacy MCP SSE transport |
| `GET /openapi.json`, `POST /tools/{name}` | OpenAPI 3.1 spec & REST tool wrappers |
| `GET /` | HTML status page (returns HTTP `200`, used by container healthchecks) |

### Local `stdio` Config Example
```json
{
  "mcpServers": {
    "fetcher": {
      "command": "npx",
      "args": ["-y", "fetcher-mcp"]
    }
  }
}
```

### Streamable HTTP Client Config Example
```json
{
  "mcpServers": {
    "fetcher-mcp": {
      "url": "http://localhost:3000/mcp"
    }
  }
}
```

---

## Container Notes & Troubleshooting

- **HTTPS with self-signed certificates**: `BrowserService` sets `ignoreHTTPSErrors: true` on Playwright contexts, allowing HTTPS fetches on internal/self-signed servers.
- **SPA returns only shell/spinner**: Retry with `waitUntil="networkidle"` and, if client-side checks redirect after load, `waitForNavigation=true`.
- **Missing navigation/tables after Markdown conversion**: Set `extractContent=false` so Mozilla Readability does not strip non-article blocks, or pass `returnText=true` for raw `innerText`.
- **`Missing session ID` HTTP 400 on `/mcp`**: `fetcher-mcp` uses stateful Streamable HTTP sessions — ensure the client sends `initialize` first without `mcp-session-id`, then echoes the returned `mcp-session-id` header on `notifications/initialized`, `tools/list`, and `tools/call`.
