---
name: reaper-qa-mcp
description: Read-only offline inspection and pre-FX audio QA for closed REAPER (.RPP) projects via the reaper-qa-mcp MCP server (dschuler36/reaper-mcp-server). Use when asked to discover .RPP projects on disk, parse track routing, folder hierarchy, FX chains, items/takes, inspect REAPER's installed plugin cache (.ini), or audit pre-FX source audio regions for clipping, loudness (LUFS), DC offset, boxy low-mid tilt, and stereo phase coherence without opening REAPER. Do not use for live REAPER editing/playback/mixing (`reaper-mcp`), Ableton Live (`ableton-mcp`), or OBS Studio (`obs-mcp`).
---

# Read-Only Offline REAPER QA (`reaper-qa-mcp`)

Inspect closed REAPER (`.RPP`) projects, local plugin caches, and pre-FX source audio files read-only via `reaper-qa-mcp` (4 tools; no live REAPER session required).

## Standard Workflow

1. **Discover projects:** Call `find_reaper_projects()` to list `.rpp` files inside the configured projects directory (`--reaper-projects-dir`).
2. **Parse routing, FX & arrangement:** Call `parse_reaper_project(project_path)` using a path returned by `find_reaper_projects()` (paths outside the projects directory are rejected).
   - Check `receives` and `main_send` on each track to separate active signal paths from muted/orphaned tracks (`main_send: false` is only audible if another track receives from it).
   - Note large `encoded_param` FX state blobs are truncated at serialization time (`<DATA_TRUNCATED: ...>`).
3. **Audit pre-FX audio quality:** Call `analyze_audio_files(project_path, track_filter=..., whole_file=False)`.
   - Reads raw source files on disk across each item's played slice (`SOFFS` and `LENGTH * playrate`) by default; set `whole_file=True` to measure full source files.
   - All results are **pre-FX and pre-fader** (`signal_stage: pre-fx`) — post-FX mix renders should be bounced and inspected with `reaper-mcp` instead.
4. **Inspect installed plugins:** Call `list_installed_fx(plugin_type=..., search_query=...)` to query REAPER's local VST2/VST3/AU/JS/CLAP cache files.

## References

- Complete 4-tool reference, metrics, warning thresholds & limits: [references/tools-reference.md](references/tools-reference.md)
- Architecture, `--reaper-projects-dir` path confinement & OS resource paths: [references/setup-and-config.md](references/setup-and-config.md)
