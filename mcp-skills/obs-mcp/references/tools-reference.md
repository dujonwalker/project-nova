# OBS MCP Tools Reference

Complete inventory of the **148 tools across 13 modules** in `obs-mcp` (`v0.2.0`), covering `obs-websocket` v5 (all requests except `Sleep`, which requires unimplemented request batches) plus 2 composite pipeline tools.

> **Name Casing**: Scene, input, source, output, transition, and filter names are **case-sensitive** and must match OBS Studio exactly.

## Pipelines (2 tools — Composite Workflows)

- **`clean_audio_input`**: Installs `Noise Gate` → `Noise Suppression` → `Compressor` in correct signal order (skipping stages already present by filter kind, reordering existing stages to match).
  - Parameters: `input_name` (required), `gate` (`true`), `suppression` (`true`), `compressor` (`true`), `gate_open_threshold_db` (`-26.0`), `gate_close_threshold_db` (`-32.0`), `suppression_method` (`"rnnoise"` or `"speex"`, auto-falls back if `noise_suppress_filter_v2` unavailable), `compressor_ratio` (`3.0`), `compressor_threshold_db` (`-18.0`).
- **`diagnose_av_health`**: Calls `GetStats`, `GetStreamStatus`, and `GetRecordStatus` together and flags GPU/render skips (>2%), encoder skips (>2% with congestion <0.1), network congestion (>0.1), active reconnects, and low disk space (<2048 MB).

## Scenes (12 tools)

`get_canvas_list`, `get_scene_list`, `get_group_list`, `get_current_program_scene`, `set_current_program_scene(scene_name)`, `get_current_preview_scene`, `set_current_preview_scene(scene_name)`, `create_scene(scene_name)`, `remove_scene(scene_name)`, `set_scene_name(scene_name, new_scene_name)`, `get_scene_transition_override(scene_name)`, `set_scene_transition_override(scene_name, transition_name, transition_duration_ms)`.

## Scene Items (17 tools)

Operates on source instances placed inside scenes (`scene_item_id` resolved via `get_scene_item_list` or `get_scene_item_id`):
`get_scene_item_list(scene_name)`, `get_group_scene_item_list(group_name)`, `get_scene_item_id(scene_name, source_name, search_offset)`, `get_scene_item_source(scene_name, scene_item_id)`, `create_scene_item(scene_name, source_name, scene_item_enabled)`, `remove_scene_item(scene_name, scene_item_id)`, `duplicate_scene_item(scene_name, scene_item_id, destination_scene_name)`, plus get/set pairs for `scene_item_transform`, `scene_item_enabled`, `scene_item_locked`, `scene_item_index` (z-order), and `scene_item_blend_mode`.

## Sources (3 tools)

Works on both inputs and scenes:
`get_source_active(source_name)`, `get_source_screenshot(source_name, image_format, ...)`, `save_source_screenshot(source_name, image_file_path, ...)`.

## Inputs & Audio Mixer (28 tools)

- **Inventory & config**: `get_input_list(input_kind)`, `get_input_kind_list(unversioned)`, `get_special_inputs()`, `create_input(input_name, input_kind, scene_name, input_settings, scene_item_enabled)`, `remove_input(input_name)`, `set_input_name(input_name, new_input_name)`, `get_input_default_settings(input_kind)`, `get_input_settings(input_name)`, `set_input_settings(input_name, input_settings, overlay)`, `get_input_properties_list_property_items(input_name, property_name)`, `press_input_properties_button(input_name, property_name)`.
- **Audio & video controls**: `get_input_mute` / `set_input_mute` / `toggle_input_mute`, `get_input_volume` / `set_input_volume` (`volume_db` or `volume_mul`), `get_input_audio_balance` / `set_input_audio_balance` (`0.0–1.0`), `get_input_audio_sync_offset` / `set_input_audio_sync_offset` (`-950..20000` ms), `get_input_audio_monitor_type` / `set_input_audio_monitor_type`, `get_input_audio_tracks` / `set_input_audio_tracks` (6 mixer tracks), `get_input_deinterlace_mode` / `set_input_deinterlace_mode`, `get_input_deinterlace_field_order` / `set_input_deinterlace_field_order`.

## Filters (10 tools)

`get_source_filter_kind_list()`, `get_source_filter_list(source_name)`, `get_source_filter_default_settings(filter_kind)`, `create_source_filter(source_name, filter_name, filter_kind, filter_settings)`, `remove_source_filter(source_name, filter_name)`, `set_source_filter_name(source_name, filter_name, new_filter_name)`, `get_source_filter(source_name, filter_name)`, `set_source_filter_index(source_name, filter_name, filter_index)`, `set_source_filter_settings(source_name, filter_name, filter_settings, overlay)`, `set_source_filter_enabled(source_name, filter_name, filter_enabled)`.

## Transitions (9 tools)

`get_transition_kind_list()`, `get_scene_transition_list()`, `get_current_scene_transition()`, `set_current_scene_transition(transition_name)`, `set_current_scene_transition_duration(duration_ms)` (`50–20000`), `set_current_scene_transition_settings(settings, overlay)`, `get_current_scene_transition_cursor()`, `trigger_studio_mode_transition()`, `set_tbar_position(position, release)`.

## Stream & Record (14 tools)

- **Streaming**: `get_stream_status()`, `toggle_stream()`, `start_stream()`, `stop_stream()`, `send_stream_caption(caption_text)`.
- **Recording**: `get_record_status()`, `toggle_record()`, `start_record()`, `stop_record()` (returns saved output file path), `toggle_record_pause()`, `pause_record()`, `resume_record()`, `split_record_file()`, `create_record_chapter(chapter_name)` (Hybrid MP4).

## Outputs (17 tools)

- **Virtual Camera**: `get_virtual_cam_status()`, `toggle_virtual_cam()`, `start_virtual_cam()`, `stop_virtual_cam()`.
- **Replay Buffer**: `get_replay_buffer_status()`, `toggle_replay_buffer()`, `start_replay_buffer()`, `stop_replay_buffer()`, `save_replay_buffer()`, `get_last_replay_buffer_replay()`.
- **Generic Outputs**: `get_output_list()`, `get_output_status(output_name)`, `toggle_output(output_name)`, `start_output(output_name)`, `stop_output(output_name)`, `get_output_settings(output_name)`, `set_output_settings(output_name, settings)`.

## Media Playback (4 tools)

`get_media_input_status(input_name)`, `set_media_input_cursor(input_name, cursor_ms)`, `offset_media_input_cursor(input_name, offset_ms)`, `trigger_media_input_action(input_name, action)`.

## Config (15 tools)

Scene collections (`get_scene_collection_list`, `set_current_scene_collection`, `create_scene_collection`), profiles (`get_profile_list`, `set_current_profile`, `create_profile`, `remove_profile`, `get_profile_parameter`, `set_profile_parameter`), video (`get_video_settings`, `set_video_settings` — width/height must be set in pairs), stream service (`get_stream_service_settings`, `set_stream_service_settings`), and recording directory (`get_record_directory`, `set_record_directory`).

## UI (8 tools)

`get_studio_mode_enabled()`, `set_studio_mode_enabled(enabled)`, `open_input_properties_dialog(input_name)`, `open_input_filters_dialog(input_name)`, `open_input_interact_dialog(input_name)`, `get_monitor_list()`, `open_video_mix_projector(...)`, `open_source_projector(...)`.

## General (9 tools)

`get_version()`, `get_stats()`, `broadcast_custom_event(event_data)`, `call_vendor_request(vendor_name, request_type, request_data)`, `get_hotkey_list()`, `trigger_hotkey_by_name(hotkey_name, context_name)`, `trigger_hotkey_by_key_sequence(key_id, shift, control, alt, command)`, `get_persistent_data(realm, slot_name)`, `set_persistent_data(realm, slot_name, slot_value)`.
