# Setup & Configuration (`home-assistant-mcp` / `ha-mcp`)

## Installation & Entrypoints

- **Recommended in Home Assistant OS/Container/Core**: **HA-MCP integration** via HACS or Home Assistant Marketplace (`>=2026.8.0`), running in-process.
- **Standalone Python CLI** (requires Python `>=3.14,<3.15`):
  - `ha-mcp` — stdio MCP server (for Docker stdio, pass `-i` so stdin remains open)
  - `ha-mcp-web` — Streamable HTTP server (default port `8086`, host `0.0.0.0`, path `/mcp`, Settings UI at `/settings`)
  - `ha-mcp-oauth` — OAuth 2.1 proxy with per-user Home Assistant tokens
  - `ha-mcp-oidc` — OIDC IdP authentication gate with shared Home Assistant credentials
- **Container image**: `ghcr.io/homeassistant-ai/ha-mcp:latest`

## Per-Endpoint Catalog URLs

Each HTTP instance serves fixed-catalog URL variants so full-catalog and small-context clients can share one server:

| Path | Behavior |
| :--- | :--- |
| `<MCP_SECRET_PATH>` (default `/mcp`) | Follows `ENABLE_TOOL_SEARCH` (`false` = full ~86 tools; `true` = search mode) |
| `<MCP_SECRET_PATH>/catalog/full` | Always serves the full tool catalog |
| `<MCP_SECRET_PATH>/catalog/search` | Always serves compact proxy/search discovery (`ha_search_tools`, ~5K tokens vs ~46K) |
| `<path>/readonly` (combinable with `/catalog/*`) | Read-only view |

## Key Environment Variables

| Variable | Default | Notes |
| :--- | :--- | :--- |
| `HOMEASSISTANT_URL` | *(required)* | Full Home Assistant URL (`http://...` or `https://...`) |
| `HOMEASSISTANT_TOKEN` | *(required except `ha-mcp-oauth`)* | Long-lived Home Assistant access token (admin recommended) |
| `HA_VERIFY_SSL` | `true` | Set `false` for self-signed certs on trusted LANs |
| `HA_TIMEOUT` / `HA_MAX_RETRIES` | `30` / `3` | Request timeout (seconds) & retries |
| `ENABLE_WEBSOCKET` | `true` | Enables WebSocket async operations & registry edits |
| `MCP_HOST` / `MCP_PORT` | `0.0.0.0` / `8086` | `ha-mcp-web` bind address (`FASTMCP_HOST` is ignored) |
| `MCP_SECRET_PATH` | `/mcp` | Secret HTTP path; recommended when binding non-loopback `0.0.0.0` |
| `ENABLE_TOOL_SEARCH` | `false` | Replaces full catalog with `ha_search_tools` + pinned/proxy tools |
| `TOOL_SEARCH_MAX_RESULTS` | `5` | Max search hits (`2-10`) |
| `PINNED_TOOLS` / `DISABLED_TOOLS` | *(empty)* | Seed values written to `tool_config.json` on first run; edited via `/settings` UI afterward |
| `ENABLE_YAML_CONFIG_EDITING` | `false` | Enables `ha_config_set_yaml` on `configuration.yaml` / `packages/*.yaml` |
| `ENABLE_SNAPSHOT_ACTIONS` | `true` | Set `false` to block all snapshot actions including listing |
| `BACKUP_READ_ONLY` | `false` | Blocks manual create/restore/delete backups while keeping automatic pre-edit backups active |
| `HAMCP_AUTOMATION_CONFIG_TIME_BUDGET` | `30` | Smart-search automation fetch budget (seconds; also `HAMCP_SCRIPT_CONFIG_TIME_BUDGET=20`, `HAMCP_SCENE_CONFIG_TIME_BUDGET=20`) |
| `HAMCP_INDIVIDUAL_CONFIG_TIMEOUT` / `HAMCP_INDIVIDUAL_FETCH_BATCH_SIZE` | `5` / `10` | Per-id fallback timeout (capped by `HA_TIMEOUT`) and concurrency |

## Client Configuration Examples

### Streamable HTTP Container (`ha-mcp-web`)

```json
{
  "mcpServers": {
    "home-assistant-mcp": {
      "url": "http://<host>:8086/mcp"
    }
  }
}
```

Or connect small-context clients to the search catalog explicitly:

```json
{
  "mcpServers": {
    "home-assistant-mcp": {
      "url": "http://<host>:8086/mcp/catalog/search"
    }
  }
}
```
