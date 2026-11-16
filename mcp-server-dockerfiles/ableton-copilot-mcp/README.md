# Ableton Live MCP Server (`ableton-mcp`)

Native Streamable HTTP Model Context Protocol (MCP) server built from [`ahujasid/ableton-mcp`](https://github.com/ahujasid/ableton-mcp) (`v1.4.5`, pinned commit `9dddc7bd5b95412510fdeb745949e3bf23f3fd8a`), connecting to the `AbletonMCP_Remote_Script` TCP socket inside Ableton Live over LAN.

[`http-transport.patch`](./http-transport.patch) configures Python `FastMCP` (`mcp[cli]`) to serve native Streamable HTTP (`/mcp`) and health endpoints (`/health`, `/healthz`) directly on `0.0.0.0:3013` without `supergateway`, and skips eager startup connection probes on per-request HTTP lifespans so `initialize` and `tools/list` respond immediately even when Ableton Live is closed.

## Configuration

Set `ABLETON_HOST` (or `ABLETON_IP`) and `ABLETON_PORT` in Compose environment variables when pointing at Ableton Live on another machine:

| Variable | Default | Description |
| --- | --- | --- |
| `ABLETON_HOST` | `host.docker.internal` | Hostname or IP of the machine running Ableton Live |
| `ABLETON_IP` | *(empty)* | Optional fallback used if `ABLETON_HOST` is unset |
| `ABLETON_PORT` | `9877` | TCP port of `AbletonMCP_Remote_Script` |
| `ABLETON_MCP_DISABLE_TELEMETRY` | `1` | Disables telemetry and dataset recording by default |
| `ABLETON_EAGER_CONNECT` | `false` | Set `true` to force connecting/handshaking on every HTTP lifespan |
| `MCP_TRANSPORT` | `streamable-http` | `streamable-http` (`/mcp`), `sse` (`/sse`), or `stdio` |
| `SSE_HOST` | `0.0.0.0` | HTTP bind address |
| `SSE_PORT` | `3013` | Host and container HTTP port |
| `MCP_STATELESS_HTTP` | `true` | Stateless Streamable HTTP mode |
| `MCP_JSON_RESPONSE` | `false` | Return JSON instead of SSE frames on `POST /mcp` when `true` |

> Note: On the machine running Ableton Live, install `AbletonMCP_Remote_Script` from upstream (`v1.4.5`) into Ableton Live's MIDI Remote Scripts folder, select `AbletonMCP` as a Control Surface, and set `ABLETON_MCP_HOST` (e.g. `0.0.0.0` or that machine's LAN IP) in its environment if connecting across the LAN instead of `127.0.0.1`.

## Build & Deployment

* **Docker build**: Builds the included Ableton MCP image for the configured platform.
* **Compose deployments**: `ableton-mcp` on `mcp` (`127.0.0.1`)

## Endpoints

* MCP Streamable HTTP: `http://127.0.0.1:3013/mcp`
* Healthcheck: `http://127.0.0.1:3013/health` (`GET /healthz` also supported)
