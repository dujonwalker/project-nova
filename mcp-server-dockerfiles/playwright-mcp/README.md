# Playwright MCP Server (`playwright-mcp`)

Official Microsoft Playwright browser automation Model Context Protocol (MCP) server using [`mcr.microsoft.com/playwright/mcp:v0.0.85`](https://github.com/microsoft/playwright-mcp) on port `3007`.

## Configuration

| Variable | Default | Description |
| --- | --- | --- |
| `SSE_HOST` | `0.0.0.0` | HTTP bind address |
| `SSE_PORT` | `3007` | Host and container HTTP/SSE port |

## Flags

* `--headless --browser chromium --no-sandbox` (from container entrypoint)
* `--host 0.0.0.0 --port 3007` — native Streamable HTTP (`/mcp`) and SSE (`/sse`)
* `--allowed-hosts *` — allow LAN/DNS Host header access from `127.0.0.1:3007`
* `--isolated` — keep browser profiles in memory so concurrent clients do not collide
* `--output-dir /tmp/playwright-mcp` — writable output path for unprivileged `node` user

## Endpoints

* MCP Streamable HTTP: `http://127.0.0.1:3007/mcp`
* Legacy SSE: `http://127.0.0.1:3007/sse`
