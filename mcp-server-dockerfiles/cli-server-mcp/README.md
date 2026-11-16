# CLI / Shell MCP Server (`cli-server-mcp`)

Native Streamable HTTP Model Context Protocol (MCP) server built from [`sonirico/mcp-shell`](https://github.com/sonirico/mcp-shell) (`v1.1.1`, commit `b358b02b`), configured for isolated/disposable agent VMs with `MCP_SHELL_ALLOW_UNSAFE=1` (`shell_exec` via `bash -c`).

## Architecture

1. **Isolated VM backend (`backend/docker-compose.yml` on target agent VM, port `3009`)**:
   - Image: built from the included Docker configuration
   - [`http-transport.patch`](./http-transport.patch) patches `main.go` (using `mark3labs/mcp-go`'s built-in `StreamableHTTPServer`) to expose native stateless Streamable HTTP (`/mcp`) alongside `/health` and `/healthz`, preserving `stdio` when `MCP_TRANSPORT=stdio`.
   - Ships [`security-unsafe.yaml`](./security-unsafe.yaml) (`enabled: false`, `working_directory: /workspace`, `max_execution_time: 120s`, `max_output_size: 4194304`) paired with `MCP_SHELL_ALLOW_UNSAFE=1` so `shell_exec` has full `bash -c` access inside the disposable VM while preserving timeout/output caps. Also retains upstream `/etc/mcp-shell/security.yaml` for typed-tool mode if `MCP_SHELL_ALLOW_UNSAFE=0`.
2. **Reverse proxy (`docker-compose.yml` on `mcp` `127.0.0.1:3009`)**:
   - `nginx:alpine` with [`nginx/default.conf.template`](./nginx/default.conf.template) forwarding `/mcp`, `/health`, and `/healthz` to `CLI_UPSTREAM_URL` (`http://127.0.0.1:3009`).

## Configuration

| Variable | Target | Default | Description |
| --- | --- | --- | --- |
| `MCP_TRANSPORT` | VM backend | `streamable-http` | `streamable-http` (`/mcp`) or `stdio` |
| `MCP_STATELESS_HTTP` | VM backend | `true` | Stateless Streamable HTTP session handling |
| `MCP_SHELL_ALLOW_UNSAFE` | VM backend | `1` | Enables `shell_exec` (`bash -c`); set `0` with `/etc/mcp-shell/security.yaml` for typed FS/Git tools only |
| `MCP_SHELL_SEC_CONFIG_FILE` | VM backend | `/etc/mcp-shell/security-unsafe.yaml` | Security/limits YAML file |
| `CLI_WORKSPACE_HOST_DIR` | VM backend | `/data/workspace` | Host bind path on VM mounted to `/workspace:rw` |
| `CLI_MCP_USER` | VM backend | `1000:1000` | Container UID:GID (`0:0` if root access on host bind mounts is desired) |
| `DOCKER_GID` | VM backend | `988` | Host `docker` group GID for `/var/run/docker.sock` access (`docker-cli` + `docker-cli-compose` included in image) |
| `CLI_UPSTREAM_URL` | `mcp` proxy | *(required)* | Upstream URL on agent VM (`http://127.0.0.1:3009`) |
| `SSE_PORT` | both | `3009` | HTTP listen port |

## Build & Deployment

* **Docker build**: Builds the included CLI/Shell MCP image for the configured platform.
* **Compose deployments**:
  1. `cli-mcp-cli-server-mcp` on `cli-mcp` (`127.0.0.1:3009`, `file_paths: ["cli-server-mcp/backend/docker-compose.yml"]`)
  2. `cli-server-mcp` on `mcp` (`127.0.0.1:3009`, `file_paths: ["cli-server-mcp/docker-compose.yml"]`, `CLI_UPSTREAM_URL=http://127.0.0.1:3009`)

## Endpoints

* MCP Streamable HTTP (`mcp`): `http://127.0.0.1:3009/mcp`
* Upstream VM backend (`cli-mcp`): `http://127.0.0.1:3009/mcp`
* Healthcheck: `http://127.0.0.1:3009/health` (`GET /healthz` also supported)
