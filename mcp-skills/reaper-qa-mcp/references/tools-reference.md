# `reaper-qa-mcp` Tools Reference

4 read-only MCP tools exposed by [`dschuler36/reaper-mcp-server`](https://github.com/dschuler36/reaper-mcp-server) (`v0.1.0`).

## Tools

### `find_reaper_projects()`
Recursively scans `--reaper-projects-dir` for `.rpp` files and returns `[{path, project_name, directory}]`.

### `parse_reaper_project(project_path: str)`
Parses an `.RPP` project file confined to `--reaper-projects-dir` and returns sanitized JSON (empty strings/collections dropped except `name`, `track_name`, `item_name`; non-finite floats converted to `null`; `encoded_param` truncated past 1024 bytes):
- Tempo and project metadata
- Tracks: `track_number`, `name`, `guid`, `is_folder`, `folder_depth`, `main_send`, `receives`, `num_channels`, `midi_hardware_out`, mixer state (`volume`, `pan`, `mute`, `solo`), FX chains
- Items: `position`, `length`, `start_offset`, `playrate`, `mute`, fades, and takes (marking the active take)

### `list_installed_fx(plugin_type: Optional[str] = None, search_query: Optional[str] = None)`
Scans REAPER's plugin cache files on disk and returns `{total_count, plugins: [{name, plugin_type, path, manufacturer?, category?}]}`.
- `plugin_type`: Optional filter (`VST2`, `VST3`, `AU`, `JS`, `CLAP`). Note `search_query` takes precedence over `plugin_type` if both are supplied.

### `analyze_audio_files(project_path: str, track_filter: Optional[str] = None, whole_file: bool = False)`
Measures source audio files referenced by tracks in `.RPP` (`signal_stage: "pre-fx (raw source files, before FX chain and fader)"`):
- Deduplicates identical `(audio_filepath, start, length)` slices so repeated clips are measured once (`distinct_regions_analyzed`).
- Skips MIDI items and items without audio sources under `skipped`.
- Supported extensions (`libsndfile`): `.wav`, `.wave`, `.bwf`, `.w64`, `.rf64`, `.aif`, `.aiff`, `.aifc`, `.flac`, `.ogg`, `.oga`, `.opus`, `.mp3`, `.caf`.
- Metrics per item:
  - **Level:** Peak dBFS, RMS, clipping detection, DC offset
  - **Frequency:** Spectral centroid and **relative** per-band energy share (low `20–200 Hz`, mid `200–2000 Hz`, high `2000–20000 Hz`)
  - **Stereo:** Stereo width, phase coherence, mono compatibility
  - **Dynamics & Loudness:** LUFS (`pyloudnorm`; `null` for regions < 400 ms), true peak, crest factor

## Built-In Warning Thresholds

- Peak `> -0.3 dBFS`: Risk of clipping
- Clipping detected: Digital distortion present
- `200–500 Hz` more than `10 dB` above `500–2000 Hz`: Boxy low mids
- Mean sample value `> 0.001`: DC offset present
- Phase coherence `< 0.5`: Phase cancellation risk
- Loudness `> -8 LUFS`: Too loud for streaming targets
- Crest factor `< 6 dB`: Potentially over-compressed
- Regions `< 50 ms` (`MIN_RELIABLE_SECONDS = 0.05`) suppress spectral/noise warnings.
