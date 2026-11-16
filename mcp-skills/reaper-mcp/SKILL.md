---
name: reaper-mcp
description: Use REAPER DAW via the reaper-mcp MCP server to compose MIDI arrangements, build drum patterns and chord progressions, run vocal-chop pipelines, load VST/JSFX chains, automate mixing and mastering across genre style profiles, set up sends and sidechains, measure loudness and audio QC, and execute ReaScripts. Prefer reaper-mcp tools directly over manual REAPER actions or external scripts whenever REAPER composition, mixing, mastering, routing, or audio analysis is requested.
---

# REAPER DAW Control (`reaper-mcp`)

Control [REAPER](https://www.reaper.fm/) directly through the `reaper-mcp` MCP server (181 tools across 26 modules covering transport, tracks, items, takes, MIDI, envelopes, sends, FX, automated mix/master, vocal chops, loop loading, ReaScripts, and offline WAV analysis).

> **Scope note:** Use `reaper-mcp` for live REAPER sessions and post-render WAV QC. Use `reaper-qa-mcp` for read-only offline `.RPP` browsing, routing/FX parsing across closed projects, and pre-FX source audio audits without opening REAPER. Do not use `reaper-mcp` for Ableton Live (`ableton-mcp`) or OBS Studio (`obs-mcp`).

## Standard Session Workflow

1. **Inspect the project first** before editing:
   - Call `project_get_overview()` or `project_get_info()` to understand structure, length, and BPM.
   - Call `get_track_instruments()` to see loaded VSTi instruments and target track indices.
   - Call `transport_get_state()` and set tempo/signature with `transport_set_bpm(...)` / `transport_set_time_signature(...)` as needed.
2. **Choose the right composition tool:**
   - Small edits (up to 2 tracks, up to 30 notes): `compose_arrangement(tracks, clear_existing)` (accepts compact shorthand or JSON).
   - Bulk MIDI writes on a single track: `midi_insert_notes_batch(item_index, notes)` or pattern helpers (`create_drum_pattern`, `create_chord_progression`).
   - CC dynamics/expression swells: `midi_insert_cc(...)` or shorthand `mp:0-6` / `ccN:start-end:v1-v2` in `compose_arrangement`. Note that `midi_get_ccs` is intentionally omitted to protect context size; use `midi_count_events(item_index)` to check counts and write fresh CC curves.
3. **Mixing, routing & post-production:**
   - Inspect installed plugins with `fx_list_installed(...)` and track chains with `fx_get_chain(track_index)`.
   - Use `setup_sidechain(...)`, `setup_drum_bus(...)`, `setup_parallel_compression(...)`, `setup_vocal_chain(...)`, or `engine_mix(style=..., clean=...)` / `engine_master(style=..., clean=...)`.
   - Use `project_export_audio(...)` or `bounce_stems(...)`, then run `analyze_*` tools on rendered WAVs if the `[analysis]` extra is installed.

## Critical Safety Rules

- **Confirm destructive actions on existing projects** before calling:
  - `wipe_all_midi(...)` (or partial `wipe_all_midi(tracks="[0,1]")`)
  - `track_delete_batch(...)`
  - `engine_mix(..., clean=True)` or `engine_master(..., clean=True)` (strips existing mix FX)
  - `script_run(...)` (arbitrary ReaScript execution)
- **Clear MIDI cleanly:** Always use `wipe_all_midi()`, never manual `item_delete` / `midi_delete_all_notes` loops or empty `edit_section` calls.
- **Clear automation cleanly:** Always use `envelope_clear_range(...)` — writing a zero point adds automation instead of resetting it.
- **Recover from mistakes:** Every change creates a named undo step; use `project_undo(steps=...)` or `project_undo_group()`.

## References

- Complete 26-module tool reference, profiles, shorthand notation, and limits: [references/tools-reference.md](references/tools-reference.md)
- Local file-based IPC bridge, REAPER Lua setup, and profile filtering: [references/setup-and-config.md](references/setup-and-config.md)
