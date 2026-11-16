---
name: prometheus-mcp
description: >-
  Use this skill whenever querying or inspecting a Prometheus instance via the
  pab1it0/prometheus-mcp-server MCP server — executing instant or range PromQL
  queries, listing cached metric names, inspecting metric metadata (type, help,
  unit), checking scrape target health, or verifying Prometheus connectivity.
  Also use when configuring prometheus-mcp-server transports (stdio, http, sse),
  stateless HTTP, TOOL_PREFIX for multi-instance setups, or auth/TLS env vars.
license: MIT
metadata:
  author: Project NOVA maintainers
  version: "1.0"
  upstream: "https://github.com/pab1it0/prometheus-mcp-server"
---

# Prometheus MCP (`prometheus-mcp`)

Use the `prometheus-mcp` MCP tools as the primary interface for discovering metrics, checking scrape target health, and running instant or range PromQL queries.

## Core Workflows

- **Verify server & Prometheus connectivity**: Call `health_check` to inspect transport/auth configuration status and verify a live `up` query against Prometheus.
- **Discover metrics & labels before querying**:
  1. Call `list_metrics` with `filter_pattern` (case-insensitive substring) and `limit`/`offset` to find exact metric names without dumping the full catalog.
  2. Call `get_metric_metadata` with `metric` (or `filter_pattern` + `limit`/`offset` in bulk mode) to check `type` (`counter`, `gauge`, `histogram`, `summary`), `help`, and `unit`.
- **Check scrape target health**: Call `get_targets` (`state="active"` by default; optionally narrow by `scrape_pool` and paginate with `limit`/`offset`) to verify target `health`, `lastError`, and scrape labels.
- **Run PromQL queries**:
  - Instant state or firing alerts (`up`, `ALERTS{alertstate="firing"}`, gauge snapshots): use `execute_query(query, time?)`.
  - Rates/trends over time (`rate(...)`, `irate(...)`): use `execute_range_query(query, start, end, step)` with RFC3339 or Unix timestamps and step widths like `"15s"`, `"1m"`, or `"1h"`.

Read [references/tools-reference.md](references/tools-reference.md) for exact parameters, return shapes, and common PromQL patterns.

## Gotchas

- **PromQL-only (6 tools)**: There are no separate REST tools for alerts, rules, series, or label values—query alerts via `ALERTS{alertstate="firing"}` and discover series/labels via PromQL (`group by (...) (...)` or `count by (...) (...)`) with `execute_query`.
- **5-minute `list_metrics` cache**: Metric names from `/api/v1/label/__name__/values` are cached in memory for `300` seconds. Pass `refresh_cache: true` after adding new exporters or scrape targets.
- **`get_targets` defaults to `state="active"`**: Dropped targets include full `discoveredLabels` and can be huge. Only pass `state="dropped"` or `state="any"` when debugging relabeling, and combine with `scrape_pool` + `limit`.
- **`get_metric_metadata` returns two different shapes**: Passing `metric="<name>"` returns a legacy `list` of entries; omitting `metric` returns a paginated `dict` (`{metadata, total_count, returned_count, offset, has_more}`).
- **Multi-instance `TOOL_PREFIX`**: Setting `TOOL_PREFIX=<name>` renames every tool to `<name>_<tool_name>` (e.g., `prod_execute_query`).
- **Context-token saving**: Set `PROMETHEUS_DISABLE_LINKS=true` on the server to omit `links` arrays (`View in Prometheus UI`) from query responses.

## Connection Setup

Read [references/setup-and-config.md](references/setup-and-config.md) when deploying `ghcr.io/pab1it0/prometheus-mcp-server` or `prometheus-mcp-server`, configuring `http`/`sse`/`stdio` transports (`PROMETHEUS_MCP_STATELESS_HTTP`), or setting TLS/auth variables.
