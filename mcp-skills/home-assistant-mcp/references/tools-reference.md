# `home-assistant-mcp` Tools Reference

`homeassistant-ai/ha-mcp` (`v9.2.0`) exposes 86 domain tools across 42 modules (plus `ha_search_tools` and `ha_call_read_tool` / `ha_call_write_tool` / `ha_call_delete_tool` proxies when search mode is active, and `skill://` resources).

## Search, State & Guidance (5 tools)

- `ha_get_skill_guide` — Reads the bundled Home Assistant best-practice `SKILL.md` (`file` optional for reference files). After loading, write tools accept `MandatoryBPS=false`.
- `ha_get_overview` — Summarizes areas, domains, entities, and system overview.
- `ha_search` — Smart/fuzzy/deep search across entities, automations, scripts, scenes, areas, and devices.
- `ha_get_state` — Gets current state and attributes for an entity.
- `ha_eval_template` — Evaluates Jinja2 templates against live Home Assistant state.

## Device Control & Services (4 tools)

- `ha_list_services` — Discovers available service domains, names, and schemas.
- `ha_call_service` — Calls any Home Assistant service (`domain`, `service`, `entity_id`/target, `data`).
- `ha_bulk_control` — Controls multiple devices/entities in bulk.
- `ha_get_operation_status` — Polls async WebSocket service/control operations.

## Registry: Entities, Devices, Areas, Labels, Zones, Categories & Groups (19 tools)

- Entities: `ha_get_entity`, `ha_set_entity` (update/rename `entity_id` or friendly name, expose/enable), `ha_remove_entity`
- Devices: `ha_get_device`, `ha_set_device`, `ha_remove_device`
- Areas & Floors: `ha_list_floors_areas`, `ha_set_area_or_floor`, `ha_remove_area_or_floor`
- Labels: `ha_config_get_label`, `ha_config_set_label`, `ha_config_remove_label`
- Categories: `ha_config_get_category`, `ha_config_set_category`, `ha_config_remove_category`
- Zones: `ha_get_zone`, `ha_set_zone`, `ha_remove_zone`
- Groups: `ha_config_list_groups`, `ha_config_set_group`, `ha_config_remove_group` *(plus `ha_manage_energy_prefs` for Energy dashboard)*

## Automations, Scripts, Scenes, Helpers, Blueprints & Calendar/Todo (22 tools)

- Automations: `ha_config_get_automation`, `ha_config_set_automation`, `ha_config_remove_automation`, `ha_get_automation_traces`
- Scripts: `ha_config_get_script`, `ha_config_set_script`, `ha_config_remove_script`
- Scenes: `ha_config_get_scene`, `ha_config_set_scene`, `ha_config_remove_scene`
- Helpers: `ha_config_list_helpers`, `ha_config_set_helper`
- Blueprints: `ha_manage_blueprints`
- Calendar: `ha_config_get_calendar_events`, `ha_config_set_calendar_event`, `ha_config_remove_calendar_event`
- To-do lists: `ha_get_todo`, `ha_set_todo_item`, `ha_remove_todo_item`
- Assist pipelines: `ha_manage_pipeline`

## Dashboards, Themes, Camera & History/Logs (12 tools)

- Dashboards: `ha_config_get_dashboard`, `ha_config_set_dashboard`, `ha_config_delete_dashboard`, `ha_get_dashboard_screenshot`
- Dashboard resources: `ha_config_list_dashboard_resources`, `ha_config_set_dashboard_resource`, `ha_config_delete_dashboard_resource`
- Themes & Camera: `ha_manage_theme`, `ha_get_camera_image`
- Diagnostics: `ha_get_history`, `ha_get_logs`, `ha_get_system_health`

## System, Backups, Integrations, Add-ons, Radios, Files & YAML (22+ tools)

- Backups: `ha_manage_backup` *(gated by `ENABLE_SNAPSHOT_ACTIONS` / `BACKUP_READ_ONLY`)*
- Core lifecycle: `ha_reload_core`, `ha_restart`
- Integrations & Add-ons & HACS & Updates: `ha_get_integration`, `ha_set_integration`, `ha_remove_helpers_integrations`, `ha_get_app`, `ha_manage_app`, `ha_get_hacs_info`, `ha_manage_hacs`, `ha_manage_updates`
- Radios & Security: `ha_manage_radio` (Zigbee, Z-Wave, Thread, Matter), `ha_manage_security_policy`
- Filesystem & YAML: `ha_list_files`, `ha_read_file`, `ha_write_file`, `ha_delete_file`, `ha_config_get_yaml`, `ha_config_set_yaml` *(requires `ENABLE_YAML_CONFIG_EDITING=true`)*
- Custom Python / Dev / Issues: `ha_manage_custom_tool`, `ha_dev_manage_server`, `ha_dev_manage_settings`, `ha_report_issue`
