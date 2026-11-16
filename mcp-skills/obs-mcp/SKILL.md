---
name: obs-mcp
description: Control and diagnose OBS Studio via `obs-mcp` (`obs-websocket` v5) — switch scenes, manage Studio Mode, configure inputs and audio mixer channels, build mic cleanup filter chains, inspect/adjust scene item transforms, toggle filters and transitions, start/stop streaming, recording, virtual cam, and replay buffer, capture source screenshots, and troubleshoot dropped frames. Use whenever interacting with OBS Studio scenes, audio/video sources, outputs, or stream health over MCP. Do not use for standalone media players, non-OBS audio editors, or OS-level display settings unrelated to OBS.
---

# OBS MCP

Full `obs-websocket` v5 control (148 tools across 13 modules) plus composite audio and health-diagnosis pipelines. Connects to a running OBS Studio 28+ instance with **Tools → WebSocket Server Settings → Enable WebSocket server** turned on.

## Core Workflow

1. **Discover exact names first**: Scene, source, input, and filter names are **case-sensitive**. Call `get_scene_list`, `get_input_list`, `get_scene_item_list`, or `get_source_filter_list` before acting on names.
2. **Prefer pipeline tools for high-level goals**:
   - Audio cleanup: Use `clean_audio_input(input_name=...)` instead of manually wiring filters — it installs Noise Gate → Noise Suppression (`rnnoise`/`speex`) → Compressor in verified signal order and skips stages already present.
   - Frame-drop / stream-health triage: Use `diagnose_av_health()` to interpret render skips (GPU/scene), output skips (encoder), network congestion, reconnecting status, and low recording disk space together.
3. **Visual verification**: Call `get_source_screenshot` (Base64) or `save_source_screenshot` to inspect live scenes or sources directly.
4. **Safe live switching**: When Studio Mode is active (`get_studio_mode_enabled`), stage changes with `set_current_preview_scene`, then cut/fade live via `trigger_studio_mode_transition`; otherwise `set_current_program_scene` switches live immediately.

## Tool Categories (148 Tools)

- **Pipelines (2)**: `clean_audio_input`, `diagnose_av_health`
- **Scenes & Scene Items (29)**: `get_scene_list`, `set_current_program_scene`, `set_current_preview_scene`, scene creation/renaming, transition overrides, `get_scene_item_list`, transforms (position/scale/crop/rotation), visibility, lock, z-order, blend mode
- **Inputs, Audio & Filters (38)**: Input CRUD/settings, mute, dB/linear volume, stereo balance, A/V sync offset, monitoring, 6-track routing, deinterlace, and full filter chain management
- **Stream, Record & Outputs (31)**: `start_stream`/`stop_stream`, captions, `start_record`/`stop_record`/`pause_record`/`split_record_file`/`create_record_chapter`, virtual cam, replay buffer (`save_replay_buffer`), generic outputs
- **Transitions, Media, Sources, Config, UI & General (48)**: Transition kinds/durations/T-bar, media playback seek/transport, source screenshots, profiles/scene collections/canvas video settings, studio mode/dialogs/projectors, stats/hotkeys/persistent data

## Guardrails

- Never guess scene, input, or filter names; verify exact casing via list tools first.
- Keep `get_stream_status` / `stop_stream` / `stop_record` side effects intentional — confirm before interrupting an active broadcast or recording unless explicitly requested.
- Check for blocking OBS modal dialogs if tool calls time out or hang.

## References

- [references/tools-reference.md](references/tools-reference.md): Complete 13-module tool catalog (all 148 tools) with pipeline parameters and defaults.
- [references/setup-and-config.md](references/setup-and-config.md): `OBS_HOST`/`OBS_PORT`/`OBS_PASSWORD` configuration, `stdio` vs HTTP-proxy container deployment, and OBS WebSocket v5 troubleshooting.
