# Blinko MCP Setup & Configuration

Configuration reference for `blinko-mcp-server` (Node.js, stateless Streamable HTTP).

## Environment Variables

| Variable | Default | Purpose |
|---|---|---|
| `BLINKO_TOKEN` (or `BLINKO_API_KEY`) | *(required)* | Blinko API Bearer token (server exits on startup if unset) |
| `BLINKO_URL` (or `BLINKO_HOST`, `BLINKO_DOMAIN`) | unset/default | Blinko instance base URL (trailing slashes and `/api` are stripped automatically; `http://`/`https://` scheme normalized) |
| `SSE_PORT` / `MCP_PORT` | `8442` | HTTP listening port (`MCP_PORT` takes precedence if set) |
| `MCP_HOST` | `0.0.0.0` | HTTP bind address |
| `NODE_TLS_REJECT_UNAUTHORIZED` | `1` (set `0` for self-signed TLS) | Allow Node `fetch` to connect to Blinko instances using self-signed LAN certificates |

---

## HTTP Endpoints

- **Streamable HTTP MCP:** `POST http://<host>:<port>/mcp` (stateless mode: `sessionIdGenerator: undefined`, `enableJsonResponse: true`; `/mcp/*` subpaths are also routed)
- **Health Checks:** `GET http://<host>:<port>/health` or `/healthz` returns `HTTP 200` JSON:
  ```json
  {
    "status": "ok",
    "server": "blinko-mcp-server",
    "version": "2.1.0",
    "transport": "http",
    "stateless": true
  }
  ```

### Example MCP Client Entry

```json
{
  "mcpServers": {
    "blinko-mcp": {
      "url": "http://localhost:8442/mcp"
    }
  }
}
```

---

## Troubleshooting

- **Startup exit (`BLINKO_TOKEN environment variable is required`)**: Ensure `BLINKO_TOKEN` or `BLINKO_API_KEY` is injected into the container/process environment.
- **Self-signed certificate failures**: Set `NODE_TLS_REJECT_UNAUTHORIZED=0` on `blinko-mcp` when connecting to a self-signed HTTPS Blinko instance.
- **`review_blinko_daily_notes(date=...)` misses older entries**: `review_blinko_daily_notes` filters only the latest 50 notes; use `search_blinko_notes(startDate="YYYY-MM-DDT00:00:00Z", endDate="YYYY-MM-DDT23:59:59Z")` for historical dates.
