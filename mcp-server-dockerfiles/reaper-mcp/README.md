# REAPER MCP Server (`reaper-mcp`)

Native Streamable HTTP Model Context Protocol (MCP) server built from [`xDarkzx/Reaper-MCP`](https://github.com/xDarkzx/Reaper-MCP) (`v0.8.3`, 181 tools for composition, mixing, mastering, batch editing, audio QC, and ReaScript automation via file-based IPC with `reaper_scripts/reaper_mcp_server.lua`).

## Architecture

Because `xDarkzx/Reaper-MCP` communicates with REAPER through file-based IPC (`command.json`, `response.json`, `server.lock` in `$TMPDIR/reaper_mcp`), deployment uses a co-located backend + reverse-proxy split matching `filesystem-mcp`:

1. **Co-located backend (`reaper-mcp-backend` on `the configured host` `127.0.0.1:3015`)**:
   - Defined in [`backend/docker-compose.yml`](./backend/docker-compose.yml) using the included image build.
   - Bind-mounts `${REAPER_IPC_HOST_DIR:-/tmp/reaper_mcp}:/ipc/reaper_mcp:rw` directly on `the configured host`.
   - [`http-transport.patch`](./http-transport.patch) configures `FastMCP` (`mcp[cli]`) for native stateless Streamable HTTP (`/mcp`), `/health` & `/healthz`, `REAPER_IPC_DIR`, `REAPER_IPC_SHARED=true` (avoids locking host user out of `/tmp/reaper_mcp` with `0700`), and skips the `stdio` parent-PID watchdog in HTTP mode.
2. **Reverse proxy (`reaper-mcp` on `mcp` `127.0.0.1:3015`)**:
   - Defined in [`docker-compose.yml`](./docker-compose.yml) using `nginx:alpine` and [`nginx/default.conf.template`](./nginx/default.conf.template), forwarding `/mcp`, `/sse`, `/messages`, `/health`, and `/healthz` to `REAPER_UPSTREAM_URL` (`http://127.0.0.1:3015`).

## Configuration

| Variable | Target | Default | Description |
| --- | --- | --- | --- |
| `REAPER_IPC_HOST_DIR` | `the configured host` | `/tmp/reaper_mcp` | Host directory shared with REAPER Lua bridge (`$TMPDIR/reaper_mcp`) |
| `REAPER_IPC_DIR` | `the configured host` | `/ipc/reaper_mcp` | Container IPC path |
| `REAPER_IPC_SHARED` | `the configured host` | `true` | Allows host REAPER user + container to share IPC directory |
| `REAPER_MCP_PROFILE` | `the configured host` | *(default: `full`)* | Optional tool profile (`full`, `compose`, `mix`, etc.) |
| `REAPER_UPSTREAM_URL` | `mcp` | `http://127.0.0.1:3015` | Upstream backend URL for nginx proxy |
| `MCP_TRANSPORT` | `the configured host` | `streamable-http` | `streamable-http` (`/mcp`), `sse` (`/sse`), or `stdio` |
| `SSE_PORT` | both | `3015` | HTTP port on `the configured host` and `mcp` |

> Note: Inside REAPER on `the configured host`, load `reaper_scripts/reaper_mcp_server.lua` from [`xDarkzx/Reaper-MCP`](https://github.com/xDarkzx/Reaper-MCP) (`Actions > Show action list > Load ReaScript`) and run it so `server.lock` is active in `/tmp/reaper_mcp`.

## Build & Deployment

* **Docker build**: Builds the included REAPER MCP image for the configured platform.
* **Compose deployments**: `reaper-mcp-backend` on `the configured host` (`127.0.0.1`) and `reaper-mcp` on `mcp` (`127.0.0.1`)

## Endpoints

* MCP Streamable HTTP (`mcp`): `http://127.0.0.1:3015/mcp` (direct backend: `http://127.0.0.1:3015/mcp`)
* Healthcheck: `http://127.0.0.1:3015/health` (`GET /healthz` also supported)
