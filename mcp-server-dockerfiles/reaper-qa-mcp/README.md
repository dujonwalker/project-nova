# REAPER Project QA MCP Server (`reaper-qa-mcp`)

Native Streamable HTTP Model Context Protocol (MCP) server built from [`dschuler36/reaper-mcp-server`](https://github.com/dschuler36/reaper-mcp-server) (`v0.1.0`, pinned commit `9f24f1076cc6f3349e3d25673f290c71d401aff0`), providing read-only `.RPP` project discovery, project parsing, pre-FX audio analysis (`numpy`/`scipy`/`soundfile`/`pyloudnorm`), and installed FX cache lookup (`list_installed_fx`).

## Architecture

Because `dschuler36/reaper-mcp-server` reads `.RPP` files, audio source files, and REAPER plugin cache `.ini` files directly from disk, deployment uses the same co-located backend + reverse-proxy split as `reaper-mcp`:

1. **Co-located backend (`reaper-qa-mcp-backend` on `the configured host` `127.0.0.1:3017`)**:
   - Defined in [`backend/docker-compose.yml`](./backend/docker-compose.yml) using the included image build.
   - Bind-mounts `${REAPER_HOME_HOST_DIR:-/data}:/data:ro` so project `.RPP` paths, audio references inside `.RPP` files, and `~/.config/REAPER` resolve cleanly read-only without changing host permissions.
   - [`http-transport.patch`](./http-transport.patch) configures `FastMCP` (`mcp[cli]`) for native stateless Streamable HTTP (`/mcp`), `/health` & `/healthz`, `REAPER_PROJECTS_DIR`, and `REAPER_RESOURCE_PATH`.
2. **Reverse proxy (`reaper-qa-mcp` on `mcp` `127.0.0.1:3017`)**:
   - Defined in [`docker-compose.yml`](./docker-compose.yml) using `nginx:alpine` and [`nginx/default.conf.template`](./nginx/default.conf.template), forwarding `/mcp`, `/sse`, `/messages`, `/health`, and `/healthz` to `REAPER_QA_UPSTREAM_URL` (`http://127.0.0.1:3017`).

## Configuration

| Variable | Target | Default | Description |
| --- | --- | --- | --- |
| `REAPER_HOME_HOST_DIR` | `the configured host` | `/data` | Host home directory bind-mounted read-only at `/data` |
| `REAPER_PROJECTS_DIR` | `the configured host` | `/data/Documents/REAPER Projects` | Directory searched for `.rpp` project files (`--reaper-projects-dir`) |
| `REAPER_RESOURCE_PATH` | `the configured host` | `/data/.config/REAPER` | REAPER resource folder scanned by `list_installed_fx` |
| `REAPER_QA_UPSTREAM_URL` | `mcp` | `http://127.0.0.1:3017` | Upstream backend URL for nginx proxy |
| `MCP_TRANSPORT` | `the configured host` | `streamable-http` | `streamable-http` (`/mcp`), `sse` (`/sse`), or `stdio` |
| `SSE_PORT` | both | `3017` | HTTP port on `the configured host` and `mcp` |

## Build & Deployment

* **Docker build**: Builds the included REAPER Project QA MCP image for the configured platform.
* **Compose deployments**: `reaper-qa-mcp-backend` on `the configured host` (`127.0.0.1`) and `reaper-qa-mcp` on `mcp` (`127.0.0.1`)

## Endpoints

* MCP Streamable HTTP (`mcp`): `http://127.0.0.1:3017/mcp` (direct backend: `http://127.0.0.1:3017/mcp`)
* Healthcheck: `http://127.0.0.1:3017/health` (`GET /healthz` also supported)
