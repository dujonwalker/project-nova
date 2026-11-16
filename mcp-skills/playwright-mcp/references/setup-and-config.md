# Playwright MCP Setup & Configuration

Configuration reference for `@playwright/mcp` (`v0.0.85`, Apache-2.0, Node.js >= 18).

## Transport Modes

### 1. Local `stdio` (Client-Spawned)

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

### 2. Standalone HTTP Server (Remote / Containerized)

Pass `--port` to expose Streamable HTTP (`/mcp`) and SSE endpoints:

```bash
npx @playwright/mcp@latest --headless --port 8931 --host 0.0.0.0 --allowed-hosts '*'
```

Client configuration:

```json
{
  "mcpServers": {
    "playwright": {
      "url": "http://localhost:8931/mcp"
    }
  }
}
```

### 3. Docker Container (`mcr.microsoft.com/playwright/mcp`)

> **Important Dockerfile Details**:
> 1. The upstream image supports **headless Chromium only** (`PLAYWRIGHT_BROWSERS_PATH=/ms-playwright`) and sets `ENTRYPOINT ["/usr/bin/tini", "-s", "--", "node", "/app/cli.js", "--headless", "--browser", "chromium", "--no-sandbox"]`.
> 2. Because `--port` is not baked into `ENTRYPOINT`, append `--port 8931 --host 0.0.0.0 --allowed-hosts '*'` (or override entrypoint with `node /app/cli.js ...`) when running a long-lived HTTP service.
> 3. **Host-header check (`--allowed-hosts`)**: Defaults to `localhost`, loopback IPs, and the `--host` value (`0.0.0.0`). Remote clients connecting by LAN IP or reverse-proxy hostname will be rejected unless listed via `--allowed-hosts` or disabled with `--allowed-hosts '*'`.

Example long-lived container:

```bash
docker run -d --rm --init --pull=always \
  --entrypoint node \
  --name playwright-mcp \
  -p 8931:8931 \
  mcr.microsoft.com/playwright/mcp \
  /app/cli.js --headless --browser chromium --no-sandbox --port 8931 --host 0.0.0.0 --allowed-hosts '*'
```

## Key CLI Flags & Environment Variables

| CLI Flag | Env Variable | Notes / Defaults |
|---|---|---|
| `--port <port>` | `PLAYWRIGHT_MCP_PORT` | Enables HTTP/SSE MCP server |
| `--host <host>` | `PLAYWRIGHT_MCP_HOST` | Bind address (default `localhost`; use `0.0.0.0` in Docker) |
| `--allowed-hosts <hosts...>` | `PLAYWRIGHT_MCP_ALLOWED_HOSTS` | DNS-rebinding host allowlist (`'*'` disables check) |
| `--caps <caps>` | `PLAYWRIGHT_MCP_CAPS` | Comma-separated opt-in capabilities (e.g. `vision,pdf,devtools,network,storage,testing,config`) |
| `--browser <browser>` | `PLAYWRIGHT_MCP_BROWSER` | `chrome`, `firefox`, `webkit`, `msedge` |
| `--headless` | `PLAYWRIGHT_MCP_HEADLESS` | Run headless (headed is default outside Docker) |
| `--no-sandbox` | `PLAYWRIGHT_MCP_NO_SANDBOX` | Required in unprivileged Linux containers |
| `--isolated` | `PLAYWRIGHT_MCP_ISOLATED` | In-memory browser profile (state discarded on close) |
| `--storage-state <path>` | `PLAYWRIGHT_MCP_STORAGE_STATE` | Initial cookies/localStorage JSON for isolated sessions |
| `--user-data-dir <path>` | `PLAYWRIGHT_MCP_USER_DATA_DIR` | Persistent profile directory (default per-workspace cache) |
| `--shared-browser-context` | `PLAYWRIGHT_MCP_SHARED_BROWSER_CONTEXT` | Share one browser context across connected HTTP clients |
| `--cdp-endpoint <endpoint>` | `PLAYWRIGHT_MCP_CDP_ENDPOINT` | Connect to an existing Chrome DevTools endpoint |
| `--extension` | `PLAYWRIGHT_MCP_EXTENSION` | Connect to Chrome/Edge via Playwright Extension |
| `--viewport-size <WxH>` | `PLAYWRIGHT_MCP_VIEWPORT_SIZE` | e.g. `1280x720` |
| `--device <device>` / `--mobile` | `PLAYWRIGHT_MCP_DEVICE` / `PLAYWRIGHT_MCP_MOBILE` | Emulate named device or generic mobile (mutually exclusive) |
| `--snapshot-mode <mode>` | `PLAYWRIGHT_MCP_SNAPSHOT_MODE` | `full` (default) or `none` |
| `--snapshot-boxes` | `PLAYWRIGHT_MCP_SNAPSHOT_BOXES` | Include `[box=x,y,width,height]` CSS-pixel coordinates |
| `--image-responses <mode>` | `PLAYWRIGHT_MCP_IMAGE_RESPONSES` | `allow` (default), `omit`, or `only` |
| `--output-dir <path>` | `PLAYWRIGHT_MCP_OUTPUT_DIR` | Directory for auto-named screenshots, PDFs, videos, traces |
| `--secrets <path>` | `PLAYWRIGHT_MCP_SECRETS_FILE` | Dotenv file whose secret values are masked in tool output |
| `--redact-url-params <names>` | `PLAYWRIGHT_MCP_REDACT_URL_PARAMS` | Replace matching query/fragment params with `<redacted>` |
| `--allowed-origins` / `--blocked-origins` | `PLAYWRIGHT_MCP_ALLOWED_ORIGINS` / `PLAYWRIGHT_MCP_BLOCKED_ORIGINS` | Browser request origin filters (not a security boundary) |
| `--timeout-action` / `--timeout-navigation` / `--timeout-settle` / `--idle-timeout` | `PLAYWRIGHT_MCP_TIMEOUT_*` / `PLAYWRIGHT_MCP_IDLE_TIMEOUT` | Defaults: action `5000ms`, navigation `60000ms`, settle `500ms`, headless idle `1h` |
| `--config <path>` | `PLAYWRIGHT_MCP_CONFIG` | JSON config file matching `Config` TypeScript schema |

## Browser Session & Auth Patterns

- **Persistent profile (default)**: Preserves cookies and storage between sessions in `--user-data-dir`, but only one browser process can lock a given profile directory at a time.
- **Isolated sessions (`--isolated`)**: Clean in-memory profile per session; pair with `--storage-state /path/to/auth.json` to pre-authenticate without mutating disk state.
- **Per-task isolation inside one server**: Use `browser_tabs` with `action: "new"` and a distinct `isolatedContext` string to isolate cookies/storage per workflow without restarting the server.
- **Attaching to an existing browser**: Use `--cdp-endpoint` (e.g. remote Chrome with debugging port) or `--extension` (Playwright Chrome Extension) instead of launching a fresh headless browser.
