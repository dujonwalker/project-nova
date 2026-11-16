# `komodo-mcp` Tools Reference

`MP-Tool/komodo-mcp-server` (`v1.5.0`) defines **88 tools across 20 `_meta.category` groups**, gated by three RBAC scopes (`komodo:read`, `komodo:operate`, `komodo:admin`).

## Common Behavior

- **Pagination:** List/info/logs tools accept `{ cursor, page_size }` (`1–100`, default `25`) and emit `_meta.page.next_cursor` when additional pages exist.
- **Out-of-band payloads:** `inspect`, `info`, `logs`, and `search_logs` return `ephemeral://...` resource links (`resources/read`, TTL `15m` info / `2m` logs) unless `inline_full: true` is passed.
- **Secret redaction:** Tool outputs, offloaded resources, and forwarded logs pass central redaction before reaching the client.

## All 88 Tools by Category

- **`config` (1):** `komodo_health_check`
- **`container` (5):** `komodo_container_list`, `komodo_container_inspect`, `komodo_container_logs`, `komodo_container_search_logs`, `komodo_container_action` (`start`, `stop`, `restart`, `pause`, `unpause`)
- **`server` (6):** `komodo_server_list`, `komodo_server_info`, `komodo_server_stats`, `komodo_server_apply` (create/update), `komodo_server_delete`, `komodo_server_action` (`start_all_containers`, `restart_all_containers`, `pause_all_containers`, `unpause_all_containers`, `stop_all_containers`, `prune_*`, `delete_network`/`image`/`volume`)
- **`stack` (5):** `komodo_stack_list`, `komodo_stack_info`, `komodo_stack_apply` (create/update), `komodo_stack_delete`, `komodo_stack_action` (`deploy`, `pull`, `start`, `restart`, `pause`, `unpause`, `stop`, `destroy`)
- **`deployment` (5):** `komodo_deployment_list`, `komodo_deployment_info`, `komodo_deployment_apply` (create/update), `komodo_deployment_delete`, `komodo_deployment_action` (`deploy`, `pull`, `start`, `restart`, `pause`, `unpause`, `stop`, `destroy`)
- **`build` (6):** `komodo_build_list`, `komodo_build_info`, `komodo_build_action` (`run`, `cancel`), `komodo_build_logs`, `komodo_build_apply` (create/update), `komodo_build_delete`
- **`repo` (5):** `komodo_repo_list`, `komodo_repo_info`, `komodo_repo_action` (`clone`, `pull`, `build`, `cancel_build`), `komodo_repo_apply` (create/update), `komodo_repo_delete`
- **`procedure` (5):** `komodo_procedure_list`, `komodo_procedure_info`, `komodo_procedure_action` (`run`), `komodo_procedure_apply` (create/update), `komodo_procedure_delete`
- **`action` (5):** `komodo_action_list`, `komodo_action_info`, `komodo_action_action` (`run`, `cancel`), `komodo_action_apply` (create/update), `komodo_action_delete`
- **`alerter` (4):** `komodo_alerter_list`, `komodo_alerter_info`, `komodo_alerter_apply` (create/update), `komodo_alerter_delete`
- **`swarm` (7):** `komodo_swarm_list`, `komodo_swarm_info`, `komodo_swarm_nodes_list`, `komodo_swarm_services_list`, `komodo_swarm_action` (`update_node`, `remove_nodes`, `remove_services`, `remove_stacks`), `komodo_swarm_apply` (create/update), `komodo_swarm_delete`
- **`resource_sync` (5):** `komodo_resource_sync_list`, `komodo_resource_sync_info`, `komodo_resource_sync_action` (`run`, `refresh`), `komodo_resource_sync_apply` (create/update), `komodo_resource_sync_delete`
- **`variable` (4):** `komodo_variable_list`, `komodo_variable_info`, `komodo_variable_apply` (create/update `value`/`description`/`is_secret`), `komodo_variable_delete`
- **`update` (2):** `komodo_update_list` (filterable, paginated), `komodo_update_info`
- **`terminal` (1):** `komodo_exec` (target: `server`, `container`, `deployment`, `stack_service`)
- **`user` (3):** `komodo_user_list_api_keys`, `komodo_user_create_api_key`, `komodo_user_delete_api_key`
- **`docker` (7):** `komodo_docker_image_list`, `komodo_docker_image_inspect`, `komodo_docker_image_history`, `komodo_docker_network_list`, `komodo_docker_network_inspect`, `komodo_docker_volume_list`, `komodo_docker_volume_inspect`
- **`builder` (6):** `komodo_builder_list`, `komodo_builder_info`, `komodo_builder_apply` (create/update), `komodo_builder_copy`, `komodo_builder_rename`, `komodo_builder_delete`
- **`tag` (4):** `komodo_tag_list`, `komodo_tag_info`, `komodo_tag_apply` (create/update), `komodo_tag_delete`
- **`toml` (2):** `komodo_toml_export_all`, `komodo_toml_export_resources`
