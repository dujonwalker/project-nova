# Fetch MCP Server (`fetch-mcp`)

Playwright headless-Chromium Model Context Protocol (MCP) server powered by [`jae-jae/fetcher-mcp`](https://github.com/jae-jae/fetcher-mcp) (`0.4.1`, `sha-66a4154`) with native Streamable HTTP (`/mcp`), SSE (`/sse`), and OpenAPI (`/openapi.json`).

## Tools

* `fetch_url` — Render a URL via Playwright headless Chromium and return Markdown (Mozilla Readability), HTML, or plain text.
* `fetch_urls` — Batch retrieve multiple URLs in parallel across browser tabs.
* `browser_install` — Check/install Playwright Chromium runtime if needed.

## Configuration

| Variable | Default | Description |
| --- | --- | --- |
| `SSE_PORT` | `3020` | Host HTTP port (mapped to container port `3000`) |
| `NODE_ENV` | `production` | Node runtime environment |

## Endpoints

* MCP Streamable HTTP: `http://127.0.0.1:3020/mcp`
* Legacy SSE: `http://127.0.0.1:3020/sse`
* OpenAPI spec / health check: `http://127.0.0.1:3020/openapi.json`
