---
name: ableton-mcp
description: Control Ableton Live via `ableton-mcp` over MCP — inspect session state, create MIDI and audio tracks, build and edit MIDI clips, import audio clips, browse and load instruments, drum kits, and effects, tweak device parameters, trigger Session playback, arrange clips and locators on the Arrangement timeline, and manage tempo. Use whenever composing, mixing, arranging, or controlling an active Ableton Live session via `ableton-mcp`. Do not use for streaming playback speakers, OBS Studio mixer control, text-to-audio generation, or offline media conversion.
---

# Ableton MCP

Two-way control over a running Ableton Live (10+) session through 37 MCP tools backed by the `AbletonMCP` MIDI Remote Script over TCP sockets (`9877` by default).

## Core Workflow

1. **Inspect session first**: Call `get_session_info` (and `get_track_info(track_index)` as needed) to confirm track indices, clip slots, tempo, and loaded devices before creating or editing anything. Run `get_remote_script_info` if a capability error occurs.
2. **Load sounds from Ableton's browser**:
   - Discover categories with `get_browser_tree` (`"all"`, `"instruments"`, `"sounds"`, `"drums"`, `"audio_effects"`, `"midi_effects"`), drill down via `get_browser_items_at_path`, then load with `load_instrument_or_effect(track_index, uri)` or `load_drum_kit(track_index, rack_uri, kit_path)`.
   - Inspect parameter indices and min/max bounds with `get_device_parameters` before calling `set_device_parameter`.
3. **Edit MIDI clips safely (additive API)**:
   - Create clips with `create_clip` (`length` in beats, default `4.0`).
   - `add_notes_to_clip` **appends** notes only; to modify existing notes cleanly, run `get_clip_notes` → edit list → `clear_notes_from_clip` → `add_notes_to_clip`.
4. **Build Arrangement sections**:
   - Create/populate Session clips first, copy them onto the timeline in beats via `duplicate_to_arrangement(track_index, clip_index, destination_time)`, mark sections with `create_locator(name, time)`, and confirm with `switch_to_arrangement_view` / `get_arrangement_clips`.
5. **Control playback**: Use `fire_clip`, `stop_clip`, `start_playback`, `stop_playback`, `set_tempo`, and `set_arrangement_time`.

## Guardrails

- Remember track and clip indices are 0-based integers; never assume indices without checking `get_session_info` or `get_track_info`.
- `create_audio_clip` requires an absolute audio file path reachable by the Ableton Live host.
- Pass `user_prompt` when helpful, and avoid calling `set_dataset_consent`, `submit_intent`, `rate_last_action`, `prefer_candidate`, `reject_last_action`, or `record_audition` unless dataset trajectory recording is intentionally enabled by the user.

## References

- [references/tools-reference.md](references/tools-reference.md): Complete 37-tool catalog with parameters, defaults, and capability-gated notes.
- [references/setup-and-config.md](references/setup-and-config.md): Remote Script setup, `ABLETON_HOST`/`ABLETON_PORT`/`ABLETON_MCP_HOST`, `stdio` vs HTTP-proxy deployment, and telemetry opt-out (`ABLETON_MCP_DISABLE_TELEMETRY=true`).
