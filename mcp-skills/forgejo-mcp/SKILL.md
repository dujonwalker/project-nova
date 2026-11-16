---
name: forgejo-mcp
description: >-
  Use this skill whenever interacting with a Forgejo instance via the
  forgejo-mcp MCP server — browsing or managing repositories, files, branches,
  branch protections, webhooks, issues, dependencies, labels, pull requests,
  code reviews, Forgejo Actions workflows/jobs/logs/secrets, releases,
  packages, wikis, organizations, attachments, or time tracking, or reading
  forgejo:// MCP resources. Also use when configuring, deploying, or
  troubleshooting forgejo-mcp (stdio, streamable HTTP, SSE, --cli mode,
  --allowed-hosts, --allow-operator-token-fallback, or OAuth resource-server
  mode).
license: MIT
metadata:
  author: Project NOVA maintainers
  version: "1.0"
  upstream: "https://git.b4mad.industries/agentic-forges/forgejo-mcp"
---

# Forgejo MCP (`forgejo-mcp`)

Use the `forgejo-mcp` MCP tools (and `forgejo://` resources when supported) as the primary interface for Forgejo operations.

## Core Workflows & Tool Selection

- **`forgejo://` resources vs. tools**: Prefer a `forgejo://` resource when you already have a specific SHA, issue/PR index, or ID; prefer `list_*` / `search_*` tools when listing or searching. Resources cap embedded lists at `30` items and include a sentinel naming the `list_*` tool when truncated.
- **Files & multi-file commits**: Use `list_repo_contents` (`path=""` for root) or `get_repo_tree` (`recursive=true` for full tree), and `get_file_content` (supports 1-indexed `start_line`/`end_line`, ignored if `with_metadata=true`). Use `change_files` to atomically create, update, and delete multiple files in one commit; `create_file`/`update_file` require **exactly one** of `content` or `content_base64` (strict standard Base64).
- **Pull requests & diffs**: Call `list_pull_request_files` first, then pass individual filenames as `file_path` to `get_pull_request_diff` to avoid loading huge multi-file diffs. Use `create_pull_review` + `submit_pull_review` and `merge_pull_request`.
- **Issues, labels & dependencies**: `create_issue` applies `labels` (comma-separated names/IDs), `assignees`, and `milestone` (numeric ID) in one call. Cross-repo dependencies are supported via `add_issue_dependency` / `remove_issue_dependency` (`depends_on_owner`/`depends_on_repo`).
- **Forgejo Actions (v16+ for run/job/artifact details)**: List runs with `list_workflow_runs`, inspect jobs with `list_action_run_jobs`, and read tail-first logs with `get_action_job_logs` (`offset`/`max_bytes`). Trigger workflows with `dispatch_workflow`.
- **Releases, packages & attachments**: `download_*_attachment` returns inline content if `< 1 MiB` and metadata + URL otherwise. `create_*_attachment` accepts base64 `content` or host `file_path` (disabled by default).

Read [references/tools-and-resources.md](references/tools-and-resources.md) for the complete tool catalog and `forgejo://` URI templates.

## Gotchas

- **Actions `run_id` != web URL `run_number`**: Run-scoped tools (`list_action_run_jobs`, `cancel_workflow_run`, `delete_workflow_run`, `list_action_run_artifacts`) require the database `run_id` returned by `list_workflow_runs`, **not** the per-repo `run_number` from `.../actions/runs/<N>`. Filter `list_workflow_runs` with `"run_number": N` to resolve the database `run_id`.
- **Wiki pages are flat**: Slash-separated titles like `Guides/Setup` do not create hierarchy or a `Guides` parent. `create_wiki_page` overwrites existing titles and returns a normalized `page_name`—always use that `page_name` in subsequent calls, and `%2F`-encode `/` in `forgejo://.../wiki/{pageName}` URIs without double-encoding.
- **`update_issue` mutual exclusions & replacements**: `due_date` (RFC3339) and `clear_due_date=true` cannot both be set. `set_labels` replaces the entire label set (`""` clears all).
- **Label guards & exclusive labels**: `create_repo_label` / `create_org_label` with `exclusive=true` requires a scoped name (`scope/value`, `/` not at either end). `delete_*_label` refuses in-use labels unless `delete_mode=force`.
- **High-impact / irreversible tools**: `delete_org` permanently deletes all repos/teams; `reset_issue_time` wipes all tracked time on an issue/PR; `delete_package` deletes one version with no preflight; `test_repo_hook` triggers a live HTTP webhook delivery; `delete_workflow_run` fails on live runs and removes logs/artifacts.
- **No `file_path` uploads by default**: `create_*_attachment` with `file_path` fails unless the server enables `FORGEJO_MCP_ALLOW_FILE_PATH_UPLOAD=1` (ideally confined via `FORGEJO_MCP_UPLOAD_ROOT`).

## Server Setup & Troubleshooting

If `forgejo-mcp` is not connected or needs transport/network/auth setup (`http`/`sse` per-request `Authorization` vs `--allow-operator-token-fallback`, `--allowed-hosts` requirement on non-loopback `--host`, `--cli` mode, or OAuth `--auth-mode resource-server`), read [references/setup-and-config.md](references/setup-and-config.md).
