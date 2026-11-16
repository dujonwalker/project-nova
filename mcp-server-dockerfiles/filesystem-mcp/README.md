# Filesystem MCP Server (`filesystem-mcp`)

`nginx:alpine` reverse proxy on `mcp` (`127.0.0.1:3022`) forwarding `/mcp`, `/sse`, `/messages`, and `/health` to the co-located `filesystem-mcp` container on `the configured host` (`http://127.0.0.1:3022`), where `${HOST_DATA_DIR:-./data}` actually lives.

The Compose stack builds the filesystem server from the included [`Dockerfile`](./Dockerfile) and [`http-transport.patch`](./http-transport.patch), using `rust-mcp-stack/rust-mcp-filesystem` `v0.4.5` with native `rust-mcp-axum` HTTP/SSE support.

## Configuration

| Variable | Default | Description |
| --- | --- | --- |
| `SSE_PORT` | `3022` | Host and nginx listening port on `mcp` |
| `FILESYSTEM_UPSTREAM_URL` | `http://127.0.0.1:3022` | Co-located `filesystem-mcp` endpoint on `the configured host` |

Runtime container settings (`HOST_SEARCH_DIR`, `ALLOW_WRITE`, `DISABLE_TOOLS`, `ENABLE_ROOTS`, `MCP_JSON_RESPONSE`) are configured through the Compose environment.

## Build & Deployment

* **Docker build**: Builds the included filesystem image for the configured platform.
* **Compose services**: The backend and HTTP proxy run as separate services on the configured Docker network.
* **Health check**: `curl -fsS http://127.0.0.1:3022/health`
* **MCP endpoint**: `http://127.0.0.1:3022/mcp`
* **Data**: Files reside in `${HOST_DATA_DIR:-./data}` and are mounted into the server container.

## Endpoints

* MCP Streamable HTTP: `http://127.0.0.1:3022/mcp`
* Legacy SSE: `http://127.0.0.1:3022/sse` (`POST /messages`)
* Healthcheck: `http://127.0.0.1:3022/health`
