# `prometheus-mcp` Tools & PromQL Reference

All 6 MCP tools exposed by `pab1it0/prometheus-mcp-server` (`v1.6.2`). All tools are read-only and idempotent (`readOnlyHint: true`, `destructiveHint: false`, `idempotentHint: true`).

If `TOOL_PREFIX` is configured on the server, every tool name becomes `<TOOL_PREFIX>_<tool_name>`.

## Tools (6 tools)

| Tool | Endpoint | Parameters | Return Shape |
| :--- | :--- | :--- | :--- |
| `health_check` | `/api/v1/query?query=up` | *(none)* | `{status ("healthy" \| "degraded" \| "unhealthy"), service, version, timestamp, transport, configuration, prometheus_connectivity, prometheus_url}` |
| `execute_query` | `/api/v1/query` | `query` (str, required), `time` (optional RFC3339 or Unix timestamp) | `{resultType, result, links?}` (`links` omitted if `PROMETHEUS_DISABLE_LINKS=true`) |
| `execute_range_query` | `/api/v1/query_range` | `query` (str), `start` (RFC3339/Unix), `end` (RFC3339/Unix), `step` (`"15s"`, `"1m"`, `"1h"`, etc.) | `{resultType, result, links?}` (`links` omitted if disabled or params unparseable) |
| `list_metrics` | `/api/v1/label/__name__/values` | `limit` (optional int), `offset` (int, default `0`), `filter_pattern` (case-insensitive substring), `refresh_cache` (bool, default `false`) | `{metrics, total_count, returned_count, offset, has_more}` (300s cache TTL) |
| `get_metric_metadata` | `/api/v1/metadata` | `metric` (optional exact metric), `filter_pattern` (matches name + metadata entries), `limit`, `offset` | When `metric` set: `list` of `{type, help, unit}`. When omitted: `{metadata, total_count, returned_count, offset, has_more}` |
| `get_targets` | `/api/v1/targets` | `state` (`"active"` \| `"dropped"` \| `"any"`, default `"active"`), `scrape_pool` (optional str), `limit`, `offset` | `{activeTargets, droppedTargets, total_active, total_dropped, returned_active, returned_dropped, offset, has_more, state}` |

## Common Node Exporter & PromQL Queries

Use with `execute_query` or `execute_range_query`:

| Check | PromQL Expression |
| :--- | :--- |
| Scrape target up/down | `up` |
| Firing alerts | `ALERTS{alertstate="firing"}` |
| CPU usage % (`5m`) | `100 - (avg by (instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)` |
| Memory used % | `(node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes * 100` |
| Disk used % | `100 - (node_filesystem_avail_bytes / node_filesystem_size_bytes * 100)` |
| Network RX bytes/s | `rate(node_network_receive_bytes_total[5m])` |
| Network TX bytes/s | `rate(node_network_transmit_bytes_total[5m])` |
| Uptime (seconds) | `node_time_seconds - node_boot_time_seconds` |
| Discover `instance` values for a job | `count by (instance) (up{job="<job>"})` |
