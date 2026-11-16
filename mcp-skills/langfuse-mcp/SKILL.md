---
name: langfuse-mcp
description: Query, inspect, and manage Langfuse AI observability data via the langfuse-mcp server — debug traces, observations, sessions, exceptions, route decisions, prompts, datasets, dataset runs, annotation queues, scores, and metrics. Use whenever interacting with Langfuse via MCP, diagnosing recorded LLM/agent failures or latency, managing Langfuse prompts or datasets, or configuring langfuse-mcp (stdio, streamable-http, tool groups, read-only mode, profiles, output modes). Do not use for ClickHouse/Docker disk troubleshooting or adding Langfuse SDK instrumentation to application source code.
---

# Langfuse MCP

Inspect recorded AI behavior and manage Langfuse resources through the `langfuse-mcp` server's 48 tools across 11 groups. Always move from the narrowest read-only discovery query to targeted ID lookups, and preserve exact IDs, filters, and lookback windows (`age` in minutes) in findings.

## References

- **All 48 tools, filters, pagination, output modes, and API/SDK caveats:** [references/tools-reference.md](references/tools-reference.md)
- **Server transports (`stdio` / `streamable-http`), profiles, tool groups, read-only mode, and troubleshooting:** [references/setup-and-config.md](references/setup-and-config.md)

## Diagnostic Workflows

Start broad, then fetch full evidence by ID:

1. **Errors & exceptions**: `find_exceptions(age=1440, group_by="file")` → pick a group → `find_exceptions_in_file(filepath=..., age=1440)` → `get_exception_details(trace_id=...)`. If a group key is `"unknown"` (missing `code.filepath`), drill down directly with its representative `trace_id` — never pass `filepath="unknown"`.
2. **Trace inspection**: `fetch_traces(age=60, user_id=...)` → `fetch_trace(trace_id=..., include_observations=true)` → `fetch_observation(observation_id=...)`.
3. **Slow LLM calls**: `fetch_observations(age=60, type="GENERATION")` or `query_metrics(view="observations", ...)` → inspect latency, tokens, and model on high-latency IDs. Always call `get_metrics_schema()` before building a new `query_metrics` query.
4. **User sessions**: `get_user_sessions(user_id=..., age=1440)` or `fetch_sessions(age=1440)` → `get_session_details(session_id=..., include_observations=true)`.
5. **Routing decisions**: `summarize_route_decisions(age=10080)` / `find_low_confidence_route_decisions()` → `get_route_decision(decision_id=...)` (reads SPAN observations with `schema_version="mcp.route_decision.v1"`).
6. **Prompts, datasets, queues & scores**: Use `list_prompts()` / `get_prompt()` / `get_prompt_unresolved()`, dataset/run tools, `list_annotation_queues()`, and `list_scores_v2()` / `get_score_v2()`.

## Critical Rules & Gotchas

- **Read-only vs writes**: Only invoke the 14 write tools (prompt creation/labeling, dataset/item/run writes/deletes, annotation-queue mutations) when the user explicitly requests that mutation. Prefer `--read-only` / `LANGFUSE_MCP_READ_ONLY=true` for pure debugging.
- **Lookback window (`age`)**: `age` is in **minutes** (1h=`60`, 24h=`1440`, 7d=`10080`) and is capped by `LANGFUSE_MAX_AGE_DAYS` (default `7` days = `10080`). Raise `LANGFUSE_MAX_AGE_DAYS` on the server when querying older retention.
- **Output modes**: Tools supporting `output_mode` default to `compact` (large fields truncated at 500 chars / responses capped around 20k). Use `output_mode="full_json_file"` (writes to `--dump-dir`, default `/tmp/langfuse_mcp_dumps`) or `full_json_string` (returns serialized JSON string) only when complete payloads are needed, as exports may contain sensitive user data.
- **Observations API v2**: `fetch_traces` omits `total_cost`, `scores`, and `observations` by default and omits traces without a root observation; pass `include_observations=true` for full observations and use `query_metrics` for aggregates. Pagination uses cursor `metadata.next_page` without `total`.
- **Immutable prompts**: Prompts are immutable; create a new version with `create_text_prompt` or `create_chat_prompt` (usually labeled `"staging"`), and promote or roll back via `update_prompt_labels`. Assigning a label removes it from other versions.
- **Preserve historical evidence**: Report recorded model names, timestamps, and metadata verbatim; do not normalize or rewrite historical identifiers.
