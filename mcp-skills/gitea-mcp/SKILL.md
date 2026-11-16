---
name: gitea-mcp
description: >-
  Use this skill whenever interacting with Gitea via the gitea-mcp MCP server —
  browsing or managing repositories, files, branches, tags, commits, issues,
  pull requests, code reviews, Gitea Actions workflows/runs/secrets, releases,
  labels, milestones, wikis, projects, packages, notifications, or time
  tracking. Also use when configuring, filtering (-S/-O/-r), or troubleshooting
  gitea-mcp itself (stdio, stateless HTTP, TLS/mTLS, OAuth 2.1).
license: MIT
metadata:
  author: Project NOVA maintainers
  version: "2.0"
  upstream: "https://gitea.com/gitea/gitea-mcp"
---

# Gitea MCP (`gitea-mcp`)

Use the `gitea-mcp` MCP tools as the primary interface for all Gitea operations.

## Tool Selection & Workflows

Most domain tools are consolidated into `_read` / `_write` pairs that take a `method` parameter. Inspect each tool's schema for exact `method` values and required arguments.

- **Discover & inspect repositories**: `get_me`, `get_user_orgs`, `search_repos`, `repo_read` (repo details, org/user repos, branch protections) → `repo_write` (create, fork, settings, topics, branch protections).
- **Browse & edit files**: `get_repository_tree` → `get_file_contents` or `get_dir_contents` → `create_or_update_file` (create, update, rename, or delete in one commit; accepts base64 content up to 32 MiB) or `delete_file`.
- **Branches, tags, commits**: `branch_read` / `branch_write`, `tag_read` / `tag_write`, `commit_read` (commits, diffs, combined statuses, compare refs) / `commit_write` (commit statuses).
- **Issues & search**: `search_issues` (full-text across repos) or `list_issues` → `issue_read` (comments, labels, dependencies, attachments) → `issue_write`. Pair with `label_read`/`label_write` and `milestone_read`/`milestone_write`.
- **Pull requests & reviews**: `list_pull_requests` → `pull_request_read` (diff, files, commits, status, reviews, comments, reviewer candidates, find by branch/commit) → `pull_request_write` (create, update, merge, close, reopen, update branch, reviewers) and `pull_request_review_write` (create/submit/delete/dismiss reviews, reply/resolve comments).
- **Gitea Actions**: `actions_run_read` (workflows, runs, jobs, logs, artifacts) → `actions_run_write` (dispatch, cancel, rerun, approve, toggle workflows); `actions_config_read` / `actions_config_write` (secrets and variables).
- **Releases, wikis, projects, packages, notifications, time**: `release_read`/`release_write`, `wiki_read`/`wiki_write`, `project_read`/`project_write`, `package_read`/`package_write`, `notification_read`/`notification_write`, `timetracking_read`/`timetracking_write`.

Read [references/tools-reference.md](references/tools-reference.md) for the complete 48-tool inventory, `-S` scope names, and Read/Write classifications.

## Gotchas

- **Pagination is silently capped**: `page` and `per_page` are clamped to the Gitea server's `[api].MAX_RESPONSE_ITEMS` (default `50`). Always paginate with `page` if a list returns 50 items.
- **Missing Write tools**: If Write tools are absent, the server is running in read-only mode (`-r` / `GITEA_READONLY=true`) or filtered by `-S`/`-O`.
- **`package_write` is irreversible**: Deleting a package version cannot be undone; confirm before calling.
- **Error shapes**: Gitea/tool failures return `tools/call` with `result.isError: true`; malformed requests or server faults return JSON-RPC errors.
- **Scope + tool filtering**: Setting both `-S` (`--scope`) and `-O` (`--tools`) loads their *union*. Deprecated legacy tool names in `-O` (e.g., `list_branches`) enable only the matching `method` on the consolidated tool.
- **No local `git` CLI operations**: `gitea-mcp` operates via Gitea's API only and does not manage local `git` working trees, staging, or `git push`.

## Server Setup & Troubleshooting

If `gitea-mcp` is not yet connected or needs transport/auth/TLS configuration, read [references/client-configs.md](references/client-configs.md) for flags, environment variables, client snippets (Claude Code, VS Code, OpenCode, Cursor, Mistral Vibe), stateless HTTP proxy requirements, mTLS, and OAuth 2.1 PKCE.
