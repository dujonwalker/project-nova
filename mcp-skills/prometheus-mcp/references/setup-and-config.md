# Setup & Configuration (`prometheus-mcp`)

## Package & Container

- **Python CLI**: `prometheus-mcp-server` (`prometheus_mcp_server.main:run_server`, Python `>=3.10`, FastMCP `>=3.1.0`)
- **Container image**: `ghcr.io/pab1it0/prometheus-mcp-server:latest` (or pinned `:1.6.2`)
- **Endpoints (HTTP mode)**: `/mcp` (Streamable HTTP) and `GET /health` (`{"status": "ok"}`)

## Environment Variables

| Variable | Default | Notes |
| :--- | :--- | :--- |
| `PROMETHEUS_URL` | *(required)* | Prometheus base URL (e.g. `http://localhost:9090`) |
| `PROMETHEUS_TOKEN` | *(empty)* | Bearer token auth (takes precedence over Basic Auth if both set) |
| `PROMETHEUS_USERNAME` / `PROMETHEUS_PASSWORD` | *(empty)* | HTTP Basic Auth credentials |
| `ORG_ID` | *(empty)* | Sends `X-Scope-OrgID` header for multi-tenant Prometheus/Mimir/Cortex |
| `PROMETHEUS_CUSTOM_HEADERS` | *(empty)* | JSON object string of extra HTTP headers |
| `PROMETHEUS_URL_SSL_VERIFY` | `True` | Set `False` to disable TLS verification |
| `REQUESTS_CA_BUNDLE` | *(unset)* | Path to custom CA bundle for `requests` |
| `PROMETHEUS_CLIENT_CERT` / `PROMETHEUS_CLIENT_KEY` | *(empty)* | Client cert (and optional private key) for mTLS |
| `PROMETHEUS_REQUEST_TIMEOUT` | `30` | HTTP request timeout in seconds |
| `PROMETHEUS_DISABLE_LINKS` | `False` | Set `True` to omit `links` UI URLs from query responses |
| `TOOL_PREFIX` | *(empty)* | Prefix for tool names (`<TOOL_PREFIX>_<tool>`) when running multiple instances |
| `PROMETHEUS_MCP_SERVER_TRANSPORT` | `stdio` | `stdio`, `http`, or `sse` |
| `PROMETHEUS_MCP_BIND_HOST` | `127.0.0.1` | Bind host for `http`/`sse` (`0.0.0.0` inside containers) |
| `PROMETHEUS_MCP_BIND_PORT` | `8080` | Bind port for `http`/`sse` |
| `PROMETHEUS_MCP_STATELESS_HTTP` | `False` | Set `True` for stateless Streamable HTTP (recommended for single/multi-replica containers) |

## Client Configuration Examples

### Streamable HTTP Container

Run the container with `PROMETHEUS_MCP_SERVER_TRANSPORT=http`, `PROMETHEUS_MCP_BIND_HOST=0.0.0.0`, and `PROMETHEUS_MCP_STATELESS_HTTP=true`, then register:

```json
{
  "mcpServers": {
    "prometheus-mcp": {
      "url": "http://<host>:8080/mcp"
    }
  }
}
```

### Local stdio (Docker)

```json
{
  "mcpServers": {
    "prometheus-mcp": {
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "-e", "PROMETHEUS_URL=http://<host>:9090",
        "ghcr.io/pab1it0/prometheus-mcp-server:latest"
      ]
    }
  }
}
```
