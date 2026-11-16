---
name: home-assistant-mcp
description: >-
  Use this skill whenever interacting with Home Assistant via the
  homeassistant-ai/ha-mcp MCP server — discovering entities, areas, and devices,
  checking states and history, calling services or bulk control, creating or
  debugging automations/scripts/scenes/helpers/dashboards, reading logs and
  traces, or managing backups and YAML config. Also use when working with
  the server's tool-search catalog (/catalog/search, ha_search_tools), bundled
  skill guides (ha_get_skill_guide), HTTP/OAuth/OIDC transports, or visibility
  flags.
license: MIT
metadata:
  author: Project NOVA maintainers
  version: "1.0"
  upstream: "https://github.com/homeassistant-ai/ha-mcp"
---

# Home Assistant MCP (`home-assistant-mcp`)

Use the `home-assistant-mcp` MCP tools as the primary interface for inspecting, controlling, configuring, and troubleshooting Home Assistant.

## Core Workflows

- **Consult built-in best practices first**: When available, call `ha_get_skill_guide()` (and pass `file="<path>"` for task-matching reference files) before writing automations, scripts, scenes, helpers, dashboards, or YAML. After reading it in-session, pass `MandatoryBPS=false` on supported write tools to avoid repeated canonical payloads.
- **Work with search-mode catalogs (`ENABLE_TOOL_SEARCH` or `/catalog/search`)**:
  1. Call direct/pinned tools (`ha_search`, `ha_get_state`, etc.) without searching for them.
  2. For unlisted tools, search with English operation keywords via `ha_search_tools(query="...")`.
  3. Inspect full parameters via `ha_search_tools(tools=["<name>"])` before calling directly (preferred) or sequentially via `ha_call_read_tool` / `ha_call_write_tool` / `ha_call_delete_tool` (`name` and `arguments` at top level).
- **Discover before acting**: Start with `ha_get_overview`, `ha_search`, `ha_list_floors_areas`, or `ha_get_state` / `ha_get_entity` / `ha_get_device` to resolve exact entity and device IDs before calling services.
- **Control & configure via domain tools**:
  - Actions: `ha_call_service`, `ha_bulk_control`, `ha_get_operation_status`, `ha_list_services`.
  - Configs: `ha_config_set_automation`, `ha_config_set_script`, `ha_config_set_scene`, `ha_config_set_helper`, `ha_config_set_dashboard`, `ha_set_entity`, `ha_set_device`, `ha_set_area_or_floor`.
  - Debugging: `ha_get_automation_traces`, `ha_get_history`, `ha_get_logs`, `ha_eval_template`, `ha_get_system_health`.

Read [references/tools-reference.md](references/tools-reference.md) for the complete 86-tool catalog grouped by domain.

## Gotchas

- **Endpoint catalog variants**: HTTP deployments expose `<path>` (configured by `ENABLE_TOOL_SEARCH`), `<path>/catalog/full` (~86 tools), `<path>/catalog/search` (proxy discovery), and `/readonly` suffixes. Clients cannot switch catalogs mid-session—pick the catalog via the server URL.
- **Registry updates require dedicated tools**: Rename `entity_id` or friendly names using `ha_set_entity` (over WebSocket inside `ha-mcp`), keeping Home Assistant's underscore-only ID rule.
- **YAML edits are opt-in**: `ha_config_set_yaml` requires `ENABLE_YAML_CONFIG_EDITING=true`; prefer typed `ha_config_set_*` tools whenever available.
- **Automatic pre-edit backups**: `BACKUP_READ_ONLY=true` blocks manual `ha_manage_backup` create/restore/delete calls while automatic pre-edit backups still run; `ENABLE_SNAPSHOT_ACTIONS=false` disables snapshot actions including listing.
- **Deep search timeouts on slow HA instances**: If `ha_search` emits partial config-fetch timeout warnings, adjust `HAMCP_INDIVIDUAL_CONFIG_TIMEOUT`, `HAMCP_INDIVIDUAL_FETCH_BATCH_SIZE`, or `HAMCP_*_CONFIG_TIME_BUDGET` (always capped by `HA_TIMEOUT`).

## Connection Setup

Read [references/setup-and-config.md](references/setup-and-config.md) when configuring `ha-mcp` (`stdio`), `ha-mcp-web` (`:8086`), `ha-mcp-oauth` / `ha-mcp-oidc`, HACS/Marketplace in-process integration, `MCP_SECRET_PATH`, or `DISABLED_TOOLS` / `PINNED_TOOLS`.
