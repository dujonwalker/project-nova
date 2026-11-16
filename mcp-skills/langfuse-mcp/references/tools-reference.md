# Langfuse MCP Tools Reference

`langfuse-mcp` exposes **48 tools** organized into **11 groups** (selectable via `--tools` or `LANGFUSE_MCP_TOOLS`).

Tools marked `*` are **write tools** (14 total) and are omitted when `--read-only` or `LANGFUSE_MCP_READ_ONLY=true` is enabled.

## Output Modes & Pagination

### `output_mode`
Supported values:
- `compact` (default unless overridden by `LANGFUSE_MCP_DEFAULT_OUTPUT_MODE`): truncates large values and caps oversized responses for token efficiency.
- `full_json_string`: returns a **JSON-encoded string** containing the full payload rather than a nested JSON object.
- `full_json_file`: writes full JSON to `--dump-dir` (default `/tmp/langfuse_mcp_dumps`) and returns a summary with `metadata.file_path` and `metadata.file_info`. Exports can contain sensitive user data.

**17 tools supporting `output_mode`:**
`fetch_traces`, `fetch_trace`, `fetch_observations`, `fetch_observation`, `find_route_decisions`, `get_route_decision`, `find_low_confidence_route_decisions`, `fetch_sessions`, `get_session_details`, `get_user_sessions`, `find_exceptions_in_file`, `get_exception_details`, `list_dataset_items`, `get_dataset_item`, `get_dataset_run`, `list_dataset_run_items`, `query_metrics`.

### Pagination (`page`, `limit`)
**14 tools supporting `page` and `limit`:**
`fetch_traces`, `fetch_observations`, `find_route_decisions`, `summarize_route_decisions`, `find_low_confidence_route_decisions`, `fetch_sessions`, `list_prompts`, `list_datasets`, `list_dataset_items`, `list_dataset_runs`, `list_dataset_run_items`, `list_annotation_queues`, `list_annotation_queue_items`, `list_scores_v2`.

On Observations API v2 endpoints (`fetch_traces`, etc.), pagination is cursor-based: `metadata.next_page` is populated when more pages exist, while `total` and `page` count may be absent.

### Filter Semantics
- `user_id`, `session_id`, `trace_id`, `parent_observation_id`: exact match.
- `metadata`: exact top-level key/value match (`object`).
- `tags`: comma-separated string or tags passed to Langfuse API.
- `name`: passed to Langfuse API (`list_prompts` uses exact name matching).

---

## Tool Catalog by Group

### 1. `traces` (2 tools)
| Tool | Key Parameters | Notes |
|---|---|---|
| `fetch_traces` | `age` (req, min), `name`, `user_id`, `session_id`, `metadata`, `tags`, `page=1`, `limit=50`, `include_observations=false`, `output_mode` | On Observations API v2, builds traces from root observations (traces without a root observation are omitted) and omits `total_cost`, `scores`, `observations` unless `include_observations=true`. |
| `fetch_trace` | `trace_id` (req), `include_observations=false`, `output_mode` | Uses `LANGFUSE_MCP_TRACE_TIMEOUT_SECONDS` (default 120s). Cannot find traces that have zero observations on Observations API v2. |

### 2. `observations` (2 tools)
| Tool | Key Parameters | Notes |
|---|---|---|
| `fetch_observations` | `age` (req, min), `type`, `name`, `user_id`, `trace_id`, `parent_observation_id`, `page=1`, `limit=50`, `output_mode` | `type`: `SPAN`, `GENERATION`, `EVENT`, `AGENT`, `TOOL`, `CHAIN`, `RETRIEVER`, `EVALUATOR`, `EMBEDDING`, or `GUARDRAIL`. |
| `fetch_observation` | `observation_id` (req), `output_mode` | Fetch full observation details by ID. |

### 3. `routing` (4 tools)
Reads `SPAN` observations whose metadata contains `schema_version="mcp.route_decision.v1"`. Common optional filters across routing tools: `age=10080`, `trace_id`, `session_id`, `router_name`, `provider`, `capability_id`.
| Tool | Key Parameters | Notes |
|---|---|---|
| `find_route_decisions` | Optional common filters + `decision_id`, `page=1`, `limit=50`, `output_mode` | List route decisions. |
| `get_route_decision` | `decision_id` (req), `age=10080`, `output_mode` | Fetch a single route decision. |
| `summarize_route_decisions` | Optional common filters + `max_confidence=0.5`, `page=1`, `limit=200` | Aggregates counts by router, provider, capability, callable state, and confidence. |
| `find_low_confidence_route_decisions` | Optional common filters + `max_confidence=0.5`, `include_uncallable=true`, `page=1`, `limit=50`, `output_mode` | Finds decisions at or below `max_confidence` (and optionally uncallable decisions). |

### 4. `sessions` (3 tools)
| Tool | Key Parameters | Notes |
|---|---|---|
| `fetch_sessions` | `age` (req, min), `page=1`, `limit=50`, `output_mode` | List recent sessions. |
| `get_session_details` | `session_id` (req), `include_observations=false`, `output_mode` | Session object with traces. |
| `get_user_sessions` | `user_id` (req), `age` (req, min), `include_observations=false`, `output_mode` | All sessions for a user in lookback window. |

### 5. `exceptions` (4 tools)
Detects errors strictly by `level == "ERROR"` observations (non-empty `status_message` alone does not match; individual exception `EVENT`s are not exposed by the standard observation listing).
| Tool | Key Parameters | Notes |
|---|---|---|
| `find_exceptions` | `age` (req, min), `group_by="file"` (`"file"`, `"function"`, `"type"`, `"name"`, `"observation_type"`) | Top 50 groups `{group, count, observation_id, trace_id}` descending. Missing metadata groups as `"unknown"` — use its `trace_id` directly rather than passing `"unknown"` to `find_exceptions_in_file`. |
| `find_exceptions_in_file` | `filepath` (req, exact recorded `code.filepath`), `age` (req, min), `output_mode` | Top 10 newest matching ERROR observations. Exact string match on recorded `code.filepath`. |
| `get_exception_details` | `trace_id` (req), `span_id`, `output_mode` | Full error context (`exception_type`, `exception_message`, `exception_stacktrace` when recorded, `filepath`, `function`, `line_number`). |
| `get_error_count` | `age` (req, min) | Returns `trace_count`, `observation_count`, and `exception_count: null` (observation-level error count basis). |

### 6. `prompts` (6 tools — 3 read, 3 write)
| Tool | Key Parameters | Notes |
|---|---|---|
| `list_prompts` | `name` (exact), `label`, `tag`, `page=1`, `limit=50` (max 100) | Lists prompt metadata (`name`, `type`, `versions`, `labels`, `tags`, `lastUpdatedAt`, `lastConfig`). |
| `get_prompt` | `name` (req), `label` or `version` (mutually exclusive) | Fetches prompt with dependencies resolved. |
| `get_prompt_unresolved` | Same as `get_prompt` | Preserves raw dependency tags (e.g. `@@@langfusePrompt:name=xxx@@@`) when SDK supports `resolve=false`; check `metadata.resolved` for fallback status. |
| `create_text_prompt`* | `name` (req), `prompt` (req, `{{vars}}`), `labels`, `config`, `tags`, `commit_message` | Creates an immutable new text prompt version. Assigning a label removes it from other versions. |
| `create_chat_prompt`* | `name` (req), `prompt` (req, list of `{role, content}`), `labels`, `config`, `tags`, `commit_message` | Creates an immutable new chat prompt version. |
| `update_prompt_labels`* | `name` (req), `version` (req), `labels` (req) | Adds labels to an existing version (preserves existing labels on that version; moves unique labels off other versions). Used for promotion & rollback. |

### 7. `datasets` (12 tools — 7 read, 5 write)
| Tool | Key Parameters | Notes |
|---|---|---|
| `list_datasets` | `page=1`, `limit=50` | List all datasets. |
| `get_dataset` | `name` (req) | Get dataset metadata/details by name. |
| `list_dataset_items` | `dataset_name` (req), `source_trace_id`, `source_observation_id`, `page=1`, `limit=50`, `output_mode` | Browse dataset items. |
| `get_dataset_item` | `item_id` (req), `output_mode` | Fetch single dataset item. |
| `create_dataset`* | `name` (req), `description`, `metadata` | Create a new dataset. |
| `create_dataset_item`* | `dataset_name` (req), `input`, `expected_output`, `metadata`, `source_trace_id`, `source_observation_id`, `item_id`, `status` (`"ACTIVE"`, `"ARCHIVED"`) | Upserts if `item_id` already exists. |
| `delete_dataset_item`* | `item_id` (req) | Delete a dataset item by ID. |
| `list_dataset_runs` | `dataset_name` (req), `page=1`, `limit=50` | Uses Experiments API (`langfuse>=4.13.1`) or legacy fallback (`ERR_LANGFUSE_EXPERIMENTS_SDK_UPGRADE` if SDK is too old when legacy route is removed). |
| `get_dataset_run` | `dataset_name` (req), `run_name` (req), `output_mode` | Fetch run details and items. |
| `list_dataset_run_items` | `dataset_id` (req), `run_name` (req), `page=1`, `limit=50`, `output_mode` | Note: takes `dataset_id` rather than `dataset_name`. |
| `create_dataset_run_item`* | `dataset_item_id` (req), `run_name` (req), `run_description`, `metadata`, `observation_id`, `trace_id` | Legacy link route; raises `ERR_LANGFUSE_RUN_ITEM_CREATE_REMOVED` after Cloud removal (use SDK experiment runner / OTel ingestion instead). |
| `delete_dataset_run`* | `dataset_name` (req), `run_name` (req), `delete_traces=false` | After legacy route removal, requires `delete_traces=True`, which also deletes the run's traces, observations, and related scores. |

### 8. `annotation_queues` (10 tools — 4 read, 6 write)
| Tool | Key Parameters | Notes |
|---|---|---|
| `list_annotation_queues` | `page=1`, `limit=50` | List annotation queues. |
| `create_annotation_queue`* | `name` (req), `description`, `score_config_ids` | Create queue. |
| `get_annotation_queue` | `queue_id` (req) | Fetch queue details. |
| `list_annotation_queue_items` | `queue_id` (req), `page=1`, `limit=50` | List items in a queue. |
| `get_annotation_queue_item` | `queue_id` (req), `item_id` (req) | Fetch a queue item. |
| `create_annotation_queue_item`* | `queue_id` (req), `object_id` (req), `object_type` (req), `status` | Add trace/observation/session item to queue. |
| `update_annotation_queue_item`* | `queue_id` (req), `item_id` (req), `status` | Update item status. |
| `delete_annotation_queue_item`* | `queue_id` (req), `item_id` (req) | Remove item from queue. |
| `create_annotation_queue_assignment`* | `queue_id` (req), `user_id` (req) | Assign reviewer to queue. |
| `delete_annotation_queue_assignment`* | `queue_id` (req), `user_id` (req) | Unassign reviewer from queue. |

### 9. `scores` (2 tools)
| Tool | Key Parameters | Notes |
|---|---|---|
| `list_scores_v2` | `page=1`, `limit=50`, `name`, `from_timestamp`, `to_timestamp`, `environment`, `source`, `score_ids`, `config_id`, `session_id`, `trace_id`, `queue_id`, `user_id`, `trace_tags`, `operator`, `value`, `data_type` | Uses Scores API v3 (`langfuse>=4.8.1`; raises `ERR_LANGFUSE_SCORES_V2_REMOVED` if older SDK). When using `operator="="` and `value` without `data_type`, defaults to `NUMERIC` (pass `data_type="BOOLEAN"` for boolean scores; `metadata.data_type_hint` is included). `user_id` and `trace_tags` rely on legacy v2 route. |
| `get_score_v2` | `score_id` (req) | Fetch a single score by ID. |

### 10. `metrics` (2 tools)
| Tool | Key Parameters | Notes |
|---|---|---|
| `get_metrics_schema` | None | Call first to discover valid views, measures, dimensions, filter operators, and query shapes. |
| `query_metrics` | `view` (`observations`, `scores-numeric`, `scores-categorical`), `metrics` (req), `dimensions`, `filters`, `age`, `from_timestamp`, `to_timestamp`, `time_granularity`, `order_by`, `output_mode` | Defaults to a 24h window when no time range is supplied. Uses Metrics v2 (Cloud) or falls back to legacy metrics route when a server returns 404. |

### 11. `schema` (1 tool)
| Tool | Key Parameters | Notes |
|---|---|---|
| `get_data_schema` | Optional dummy arg | Returns response structure documentation for all tools. |
