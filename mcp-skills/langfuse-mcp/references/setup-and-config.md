# Langfuse MCP Setup & Configuration

Configuration reference for `avivsinai/langfuse-mcp` (Python >= 3.10).

## Transports & Client Wiring

### 1. Local `stdio` (uvx / Docker)
Standard local setup via `.mcp.json` or CLI registration:

```json
{
  "mcpServers": {
    "langfuse": {
      "command": "uvx",
      "args": ["langfuse-mcp"],
      "env": {
        "LANGFUSE_PUBLIC_KEY": "pk-lf-...",
        "LANGFUSE_SECRET_KEY": "sk-lf-...",
        "LANGFUSE_HOST": "https://langfuse.example.orggfuse.com"
      }
    }
  }
}
```

Pin a specific Python version with `uvx --python 3.14 langfuse-mcp` if the default interpreter is older than 3.10.

### 2. Streamable HTTP (`--transport streamable-http`)
Serves MCP at `http://<bind-host>:<port>/mcp` (defaults: `127.0.0.1:8000`):

```bash
langfuse-mcp --transport streamable-http --bind-host 0.0.0.0 --port 8000
```

Supports two credential modes over HTTP:
- **Single default project**: supply `LANGFUSE_PUBLIC_KEY` and `LANGFUSE_SECRET_KEY` at server startup.
- **Multi-project routing via `Authorization: Basic`**: omit startup keys (or override them per client) by sending `Authorization: Basic <base64(public_key:secret_key)>` in MCP client headers. Note: malformed `Authorization` headers are rejected outright without fallback.
- **Security**: Always front `--bind-host 0.0.0.0` with a TLS-terminating reverse proxy if traffic leaves localhost/trusted LAN, because Basic headers carry API keys in Base64 over plain HTTP. If startup keys are set on a shared proxy, ensure the proxy authenticates callers.

### 3. Multi-Project TOML Profiles (`stdio`)
Store multiple project credentials in `$XDG_CONFIG_HOME/langfuse-mcp/profiles.toml` (default `~/.config/langfuse-mcp/profiles.toml`) or `--profiles-file` / `LANGFUSE_MCP_PROFILES_FILE`:

```toml
[profiles.prod]
host = "https://langfuse.example.orggfuse.com"
public_key = "pk-lf-..."
secret_key_env = "LANGFUSE_PROD_SECRET_KEY"

[profiles.staging]
host = "https://langfuse.example.com"
public_key = "pk-lf-..."
secret_key = "sk-lf-..."
```

Select with `--profile <name>` or `LANGFUSE_MCP_PROFILE`. Precedence is:
`CLI flags (--public-key, --secret-key, --host)` > `LANGFUSE_* env vars` > `profile` > `defaults`.

---

## CLI Flags & Environment Variables

| CLI Flag | Environment Variable | Default | Purpose |
|---|---|---|---|
| `--public-key` | `LANGFUSE_PUBLIC_KEY` | - | API public key (`pk-...`) |
| `--secret-key` | `LANGFUSE_SECRET_KEY` | - | API secret key (`sk-...`) |
| `--host` | `LANGFUSE_HOST` | `https://langfuse.example.orggfuse.com` | Langfuse instance base URL |
| `--profile` | `LANGFUSE_MCP_PROFILE` | unset | Profile name in `profiles.toml` |
| `--profiles-file` | `LANGFUSE_MCP_PROFILES_FILE` | `~/.config/langfuse-mcp/profiles.toml` | Custom TOML profiles file |
| `--timeout` | `LANGFUSE_TIMEOUT` | `30` | API timeout in seconds |
| - | `LANGFUSE_MCP_TRACE_TIMEOUT_SECONDS` | `120` | Single-trace (`fetch_trace`) read timeout when loading heavy `include_observations=true` payloads |
| - | `LANGFUSE_MAX_AGE_DAYS` | `7` | Max lookback window in days (`7` = `10080` min) |
| `--tools` | `LANGFUSE_MCP_TOOLS` | `all` | Comma-separated subset of the 11 tool groups |
| `--read-only` | `LANGFUSE_MCP_READ_ONLY` | `false` | Disables all 14 write tools |
| `--default-output-mode` | `LANGFUSE_MCP_DEFAULT_OUTPUT_MODE` | `compact` | Default `output_mode` (`compact`, `full_json_string`, `full_json_file`) |
| `--dump-dir` | - | `/tmp/langfuse_mcp_dumps` | Directory for `full_json_file` exports |
| `--cache-size` | - | `100` | LRU cache size for observations/exceptions |
| `--transport` | `LANGFUSE_MCP_TRANSPORT` | `stdio` | `stdio` or `streamable-http` |
| `--port` | `LANGFUSE_MCP_PORT` | `8000` | HTTP server port |
| `--bind-host` | `LANGFUSE_MCP_BIND_HOST` | `127.0.0.1` | HTTP bind address |
| `--log-level` | `LANGFUSE_LOG_LEVEL` | `INFO` | `CRITICAL`, `ERROR`, `WARNING`, `INFO`, `DEBUG` |
| `--log-to-console` | `LANGFUSE_LOG_TO_CONSOLE` | `false` | Keep `false` under `stdio` to avoid breaking JSON-RPC frames |
| - | `LANGFUSE_MCP_LOG_FILE` | `/tmp/langfuse_mcp.log` | Rotating log file path |

### Valid Tool Groups (`LANGFUSE_MCP_TOOLS`)
`traces`, `observations`, `routing`, `sessions`, `exceptions`, `prompts`, `datasets`, `annotation_queues`, `scores`, `metrics`, `schema` (or `all`).

### Read-Only Mode (`--read-only`)
Disables these 14 write tools:
- **Prompts**: `create_text_prompt`, `create_chat_prompt`, `update_prompt_labels`
- **Datasets & runs**: `create_dataset`, `create_dataset_item`, `delete_dataset_item`, `create_dataset_run_item`, `delete_dataset_run`
- **Annotation queues**: `create_annotation_queue`, `create_annotation_queue_item`, `update_annotation_queue_item`, `delete_annotation_queue_item`, `create_annotation_queue_assignment`, `delete_annotation_queue_assignment`

---

## Lookback (`age`) Reference

| Time Range | `age` (minutes) |
|---|---|
| 1 hour | `60` |
| 6 hours | `360` |
| 12 hours | `720` |
| 24 hours (1 day) | `1440` |
| 3 days | `4320` |
| 7 days (default max) | `10080` |

## Common Troubleshooting

- **Empty `fetch_traces` results**: Confirm `age` is in minutes (not hours/days), ensure traces are within `LANGFUSE_MAX_AGE_DAYS`, and remember that on Observations API v2 traces without a root observation do not appear in `fetch_traces` (check `fetch_observations` directly).
- **Large trace timeouts**: Increase `LANGFUSE_MCP_TRACE_TIMEOUT_SECONDS` (default `120`) or `LANGFUSE_TIMEOUT` (default `30`), and use `output_mode="full_json_file"` instead of loading oversized JSON strings inline.
- **`stdio` transport disconnects**: Ensure `LANGFUSE_LOG_TO_CONSOLE` is `false` (default) so log lines do not corrupt stdout JSON-RPC messages, and inspect `LANGFUSE_MCP_LOG_FILE`.
