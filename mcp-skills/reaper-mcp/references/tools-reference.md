# `reaper-mcp` Tools Reference

`xdarkzx-reaper-mcp` (v0.8.3) provides **181 tools across 26 modules**. Use `REAPER_MCP_PROFILE` to limit exposed tools to what the task needs.

## Built-In Profiles

| Profile | Description |
| :--- | :--- |
| `full` | All 26 modules and all instruction packs (default) |
| `composition` | Transport, tracks, templates, project, items, takes, MIDI, quantize, markers, tempo, selection, composition utility/editing, patterns, loops, vocal chops, ReaScript |
| `production` | Composition + FX, FX inventory, mix/master, sidechain, bus pipelines, envelopes (no markers/tempo/patterns/vocal chops/ReaScript/analysis) |
| `mixing` | Transport, tracks, FX, FX inventory, mix/master, sidechain, bus pipelines, sends, envelopes, analysis, composition editing, loops |
| `analysis` | Transport, tracks, project, audio analysis, composition utility, loops |
| `minimal` | Transport, tracks, project, loops |

## Tool Catalog by Module

- **Transport (11):** `transport_play()`, `transport_stop()`, `transport_pause()`, `transport_record()`, `transport_get_state()`, `transport_set_position(seconds)`, `transport_set_bpm(bpm)`, `transport_set_time_signature(numerator, denominator)`, `transport_toggle_repeat()`, `transport_toggle_metronome()`, `transport_set_playrate(rate)`
- **Tracks (18):** `track_get_all()`, `track_get_info(track_index)`, `track_create(index=-1, name="")`, `track_delete_batch(entries)`, `track_rename(track_index, name)`, `track_set_volume(track_index, volume_db)`, `track_set_pan(track_index, pan)`, `track_set_mute(track_index, mute)`, `track_set_solo(track_index, solo)`, `track_set_record_arm(track_index, arm)`, `track_set_color(track_index, r, g, b)`, `track_select(track_index, selected=True, exclusive=False)`, `track_set_input(track_index, input_index)`, `track_get_mixer_state()`, `track_get_peak(track_index)`, `track_freeze(track_index)`, `track_unfreeze(track_index)`, `track_set_folder(track_index, folder_depth)`
- **Track Templates (4):** `track_template_save(track_index, name)`, `track_template_apply(name, track_index)`, `track_template_list()`, `track_template_delete(name)`
- **Project (18):** `project_get_info()`, `project_get_change_count()`, `project_get_overview()`, `project_new()`, `project_open(path)`, `project_save()`, `project_save_as(path)`, `project_export_audio(path, format="wav")`, `project_undo(steps=1)`, `project_redo(steps=1)`, `project_undo_group()`, `project_get_notes()`, `project_set_notes(notes)`, `project_get_metadata()`, `project_set_metadata(...)`, `project_get_notes_info()`, `project_set_notes_info(title="", author="")`, `project_set_grid(grid_division)`
- **Items (14):** `item_get_all(track_index=-1, max_results=200)`, `item_get_info(item_index)`, `item_select(item_index, selected=True, exclusive=False)`, `item_split(item_index, position)`, `item_delete(item_index)`, `item_move(item_index, new_position)`, `item_set_length(item_index, length)`, `item_set_volume(item_index, volume_db)`, `item_set_mute(item_index, mute)`, `item_set_fade(item_index, fade_in=-1, fade_out=-1)`, `item_insert_media(track_index, path, position=0.0)`, `item_create_midi(track_index, position=0.0, length=4.0)`, `item_move_to_track(item_index, dest_track_index)`, `items_apply(entries)`
- **Takes (4):** `item_take_list(item_index)`, `item_take_set_active(item_index, take_index)`, `item_take_add(item_index)`, `item_take_delete_active(item_index)`
- **MIDI (15):** `midi_insert_note(...)`, `midi_insert_notes_batch(item_index, notes)`, `midi_get_notes(item_index, max_results=500)`, `midi_set_note(...)`, `midi_delete_note(item_index, note_index)`, `midi_select_notes(item_index, select_all=True)`, `midi_delete_all_notes(item_index)`, `midi_insert_cc(...)`, `midi_delete_cc(item_index, cc_index)`, `midi_insert_program_change(...)`, `midi_list_programs(track_index)`, `midi_get_note_names()`, `midi_count_events(item_index)`, `midi_sort(item_index)`, `midi_set_item_extents(item_index, start_qn, end_qn)`
- **MIDI Quantize / Humanize (3):** `midi_quantize(item_index, grid_qn, strength=1.0, swing=0.0)`, `midi_humanize(item_index, time_jitter_ms=10.0, velocity_jitter=5)`, `project_set_ripple_mode(mode)`
- **Markers & Regions (7):** `marker_get_all()`, `marker_add(...)`, `marker_add_region(...)`, `marker_delete(marker_index)`, `marker_edit(...)`, `marker_go_to(marker_number)`, `markers_apply(entries)`
- **Tempo Map (4):** `tempo_list_markers()`, `tempo_add_marker(time, bpm, num=-1, denom=-1, linear=False)`, `tempo_delete_marker(index)`, `tempo_clear_all()`
- **Envelopes (3):** `envelope_get_points(...)`, `envelope_add_points(...)`, `envelope_clear_range(track_index, envelope_name, start, end)`
- **Selection (9):** `selection_set_time(start, end)`, `selection_get_time()`, `selection_set_loop(start, end)`, `selection_select_all_items()`, `selection_deselect_all_items()`, `selection_select_all_tracks()`, `selection_deselect_all_tracks()`, `selection_get_selected_tracks()`, `selection_get_selected_items()`
- **Sends & Routing (8):** `send_create(...)`, `send_remove(track_index, send_index)`, `send_get_all(track_index)`, `send_set_volume(...)`, `send_set_pan(...)`, `send_set_mute(...)`, `send_set_midi_channel(...)`, `send_get_routing_diagram()`
- **FX & FX Inventory (2 modules):** `fx_remove_batch(entries)`, `fx_get_chain(track_index)`, `fx_get_params(track_index, fx_index)`, `fx_scan_params(track_index, fx_index)`, `fx_enable(track_index, fx_index)`, `fx_disable(track_index, fx_index)`, `fx_show_ui(track_index, fx_index)`, `fx_get_preset(track_index, fx_index)`, `fx_set_preset(...)`, `fx_navigate_preset(...)`, `fx_get_instrument(track_index)`, `fx_move(...)`, `fx_rename(...)`, `fx_get_pin_mappings(...)`, `fx_list_installed(...)`, `set_fx_preferences(preferences)`
- **Mix, Master & Routing Engines (3 modules):** `engine_mix(style="", clean=True)`, `engine_master(style, clean=True)`, `engine_fix_mix(style="", include_master=True)`, `setup_sidechain(...)`, `setup_parallel_compression(...)`, `setup_drum_bus(...)`, `setup_vocal_chain(...)`, `bounce_stems(...)`
- **Composition Utility & Editing (2 modules):** `get_track_instruments()`, `analyze_score(...)`, `compose_arrangement(tracks, clear_existing=False, ...)`, `wipe_all_midi(tracks="")`, `reset_composition()`, `configure_tracks(tracks)`, `setup_routing(sends)`, `add_markers_batch(markers)`, `rewrite_cc(...)`, `edit_section(...)`, `setup_fx_chain(tracks)`, `setup_effect_bus(...)`
- **Patterns & Loops (2 modules):** `create_drum_pattern(...)`, `create_chord_progression(...)`, `scan_audio_folder(...)`, `detect_common_bpm(file_paths)`, `load_loops(loops, project_bpm=0)`
- **Vocal Chops (10):** `item_split_at_transients(item_index)`, `item_split_at_positions(item_index, positions)`, `take_set_pitch(...)`, `take_set_playrate(...)`, `take_set_reversed(item_index)`, `item_duplicate(...)`, `analyze_chop_set(item_indices)`, `arrange_chops_to_chord_tones(...)`, `stack_chop_layers(...)`, `chop_pipeline(...)`
- **Audio Analysis (7, requires `[analysis]` extra):** `analyze_loudness(wav_path, reference="streaming")`, `analyze_clipping(wav_path, threshold_db=-0.1)`, `analyze_frequency_spectrum(wav_path)`, `analyze_stereo_field(wav_path)`, `analyze_silence(wav_path, threshold_db=-40.0, min_duration=0.3)`, `analyze_peaks(wav_path, sensitivity=3.0)`, `analyze_region_qc(wav_path, regions)`
- **ReaScript & Demo (2 modules):** `script_list(filter="")`, `script_run(script_path, wait_seconds=5.0)`, `demo_edm_project(clean_first=True, bpm=140.0)`

## Shorthand Notation (`compose_arrangement`)

One line per track: `TRACK_INDEX | NOTES | CC_CURVES`
- **Notes:** `NoteName:Duration:Velocity` (sequential; e.g., `D3:2.5:65`, `C4` = MIDI 60)
- **Chords:** `Note+Note+Note` (simultaneous; e.g., `D3:4:70+A3:4:70`)
- **Rests & jumps:** `r:Duration`, `@Seconds`
- **Dynamics & CC:** `pp`/`p`/`mp`/`mf`/`f`/`ff` with `Start-End` (generates CC1+CC11 ramps), or `ccN:Start-End:Val1-Val2`
- **Keyswitches:** `ks:0` .. `ks:3`

## Built-In Safety Caps

- `MAX_COMPOSE_TRACKS = 50`, `MAX_NOTES_PER_TRACK = 10000`, `MAX_TOTAL_NOTES_PER_CALL = 50000`
- `MAX_NOTES_READ_RESULTS = 10000`, `MAX_ENVELOPE_POINTS_PER_CALL = 50000`
- `MAX_SCAN_PARAMS = 200`, `MAX_ANALYSIS_CANDIDATES = 300`, `MAX_ANALYSIS_CANDIDATES_PER_REGION = 50`
- Allowed `project_export_audio` formats: `wav`, `mp3`, `ogg`, `flac`, `aiff`
