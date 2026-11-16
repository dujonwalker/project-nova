---
name: komodo-mcp
description: Manage and inspect Komodo infrastructure via the `komodo-mcp` MCP server (`MP-Tool/komodo-mcp-server`) — check connectivity (`komodo_health_check`), list and control servers, stacks, deployments, containers, builds, repos, procedures, actions, alerters, Docker Swarms, resource syncs, variables, updates, Docker images/networks/volumes, builders, tags, TOML exports, container logs, and remote shell execution (`komodo_exec`). Use whenever inspecting or operating Komodo-managed infrastructure over MCP. Do not use for standalone Git hosting APIs, non-Komodo host monitoring, or raw shell execution outside Komodo targets.
---

# Komodo MCP (`komodo-mcp`)

Control Komodo Core resources and Docker/Podman hosts via [`MP-Tool/komodo-mcp-server`](https://github.com/MP-Tool/komodo-mcp-server) (`v1.5.0`, `88` tools across `20` categories).

## Capability & Access Modes

- **Three-tier RBAC (`requiredScopes`):** `komodo:read` (inspection/logs), `komodo:operate` (`*_action` lifecycle calls), `komodo:admin` (create/update/delete, prune, `komodo_exec`).
- **Open HTTP invariant:** Disabling MCP auth (`MCP_AUTH_ENABLED=false`) on HTTP/HTTPS puts the server into strict **read-only** mode (`komodo:read` only; write/operate/exec tools are hidden and rejected). Full write capability requires HTTP login (`MCP_AUTH_ENABLED=true`) or local `stdio`.
- **Tool-surface pruning:** Operators may hide categories/tools via `MCP_TOOLS_ALLOWED_CATEGORIES`, `MCP_TOOLS_EXCLUDED_CATEGORIES`, or `MCP_TOOLS_EXCLUDED_TOOLS`.

## Core Workflow

1. **Inspect before mutating:**
   - Start with `komodo_health_check`, `komodo_server_list`, `komodo_stack_list`, `komodo_container_list`, `komodo_build_list`, or `komodo_repo_list`.
   - Follow cursor pagination (`{ cursor, page_size }`, `1–100`, default `25`) using `_meta.page.next_cursor` when lists are partial.
2. **Handle offloaded payloads (`ephemeral://...`):**
   - `inspect`, `info`, `logs`, and `search_logs` return session-scoped `ephemeral://...` resource links for large responses — fetch them via `resources/read`, or pass `inline_full: true` when inline content is required.
3. **Verify async operations & respect confirmations:**
   - After `komodo_stack_action` (`deploy`, `pull`, `restart`), `komodo_build_action` (`run`), or `komodo_deployment_action`, check `komodo_update_list` / `komodo_update_info` (or `komodo_build_logs`) to confirm completion.
   - Destructive tools (`*_delete`, `destroy`, `prune_*`, `komodo_exec`, `procedure`/`action`/`resource_sync` runs) prompt via MCP elicitation when `MCP_CONFIRM_DESTRUCTIVE=true` (fail-closed when `MCP_CONFIRM_FALLBACK=deny`).

## References

- Complete 20-category, 88-tool catalog and actions: [references/tools-reference.md](references/tools-reference.md)
- Auth layers, read-only invariant, redaction, confirmations & config: [references/setup-and-config.md](references/setup-and-config.md)
