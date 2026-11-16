# OBS Studio MCP Server (`obs-mcp`)

Native Streamable HTTP Model Context Protocol (MCP) server built from [`xDarkzx/OBS_MCP`](https://github.com/xDarkzx/OBS_MCP) (`v0.2.0`, 148 tools covering OBS WebSocket v5 scenes, sources, audio mixer, filters, transitions, streaming, recording, studio mode, replay buffer, virtual camera, screenshots, and AV diagnostics).

[`http-transport.patch`](./http-transport.patch) configures Python `FastMCP` (`mcp[cli]`) to serve native Streamable HTTP (`/mcp`) and health endpoints (`/health`, `/healthz`) directly on `0.0.0.0:3012` without `supergateway`.

## Configuration

Set either `OBS_HOST` + `OBS_PORT` + `OBS_PASSWORD` or `OBS_WEBSOCKET_URL` + `OBS_WEBSOCKET_PASSWORD` in Compose environment variables:

| Variable | Default | Description |
| --- | --- | --- |
| `OBS_HOST` | `host.docker.internal` | OBS Studio WebSocket host/IP (`Tools > WebSocket Server Settings`) |
| `OBS_PORT` | `4455` | OBS Studio WebSocket port |
| `OBS_PASSWORD` | *(empty)* | OBS WebSocket password (leave empty if auth disabled) |
| `OBS_WEBSOCKET_URL` | *(empty)* | Optional `ws://<host>:<port>` fallback if `OBS_HOST` is unset |
| `OBS_WEBSOCKET_PASSWORD` | *(empty)* | Optional fallback if `OBS_PASSWORD` is unset |
| `MCP_TRANSPORT` | `streamable-http` | `streamable-http` (`/mcp`), `sse` (`/sse`), or `stdio` |
| `SSE_HOST` | `0.0.0.0` | HTTP bind address |
| `SSE_PORT` | `3012` | Host and container HTTP port |
| `MCP_STATELESS_HTTP` | `true` | Stateless Streamable HTTP mode |
| `MCP_JSON_RESPONSE` | `false` | Return JSON instead of SSE frames on `POST /mcp` when `true` |

## Build & Deployment

* **Docker build**: Builds the included OBS MCP image for the configured platform.
* **Compose deployments**: `obs-mcp` on `mcp` (`127.0.0.1`)

## Endpoints

* MCP Streamable HTTP: `http://127.0.0.1:3012/mcp`
* Healthcheck: `http://127.0.0.1:3012/health` (`GET /healthz` also supported)
