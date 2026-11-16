# Ableton MCP Tools Reference

Complete inventory of the **37 tools** exposed by `ahujasid/ableton-mcp` (`v1.4.5`, Remote Script `v1.7.1`). Every tool also accepts an optional `user_prompt: str = ""` telemetry parameter.

## Session, Handshake & Inspection (4 tools)

| Tool | Parameters (Required / Optional) | Notes |
|---|---|---|
| `get_session_info` | `user_prompt` (`""`) | Tempo, signature, track count, track summaries |
| `get_remote_script_info` | `user_prompt` (`""`) | Handshake version & capabilities (`EXPECTED_REMOTE_SCRIPT_VERSION`) |
| `get_track_info` | `track_index` (`int`), `user_prompt` (`""`) | Clips, devices, volume/pan/mute/arm for one track |
| `get_session_snapshot` | `include_notes` (`bool`), `include_params` (`bool`), `user_prompt` (`""`) | Full project state snapshot (capability-gated) |

## Tracks & Tempo (4 tools)

| Tool | Parameters | Notes |
|---|---|---|
| `create_midi_track` | `index` (`int = -1`), `user_prompt` | `-1` appends at end |
| `create_audio_track` | `index` (`int = -1`), `user_prompt` | `-1` appends at end; use for audio clips/stems |
| `set_track_name` | `track_index` (`int`), `name` (`str`), `user_prompt` | Rename track |
| `set_tempo` | `tempo` (`float`), `user_prompt` | Session BPM |

## Session Clips & MIDI (9 tools)

| Tool | Parameters | Notes |
|---|---|---|
| `create_clip` | `track_index`, `clip_index`, `length` (`float = 4.0`), `user_prompt` | Empty Session MIDI clip (length in beats) |
| `create_audio_clip` | `track_index`, `clip_index`, `path` (`str`), `user_prompt` | Imports audio file from an absolute path on the Ableton host |
| `get_clip_notes` | `track_index`, `clip_index`, `user_prompt` | Reads `{pitch, start_time, duration, velocity, mute}` notes (capability-gated) |
| `add_notes_to_clip` | `track_index`, `clip_index`, `notes` (`list[dict]`), `user_prompt` | **Appends** notes (`pitch`, `start_time`, `duration`, `velocity`, `mute`) |
| `clear_notes_from_clip` | `track_index`, `clip_index`, `user_prompt` | Removes all notes before rewriting (capability-gated) |
| `set_clip_name` | `track_index`, `clip_index`, `name`, `user_prompt` | Rename Session clip |
| `fire_clip` | `track_index`, `clip_index`, `user_prompt` | Launch Session clip |
| `stop_clip` | `track_index`, `clip_index`, `user_prompt` | Stop Session clip |
| `delete_clip` | `track_index`, `clip_index`, `user_prompt` | Delete Session clip slot contents (capability-gated) |

## Transport (2 tools)

- `start_playback(user_prompt="")`
- `stop_playback(user_prompt="")`

## Browser & Devices (6 tools)

| Tool | Parameters | Notes |
|---|---|---|
| `get_browser_tree` | `category_type` (`"all"`), `user_prompt` | Top-level Ableton browser tree |
| `get_browser_items_at_path` | `path` (`str`), `user_prompt` | Drill into browser path to retrieve item `uri` values |
| `load_instrument_or_effect` | `track_index`, `uri` (`str`), `user_prompt` | Load instrument/effect URI onto track |
| `load_drum_kit` | `track_index`, `rack_uri` (`str`), `kit_path` (`str`), `user_prompt` | Load Drum Rack then specific kit inside it |
| `get_device_parameters` | `track_index`, `device_index`, `user_prompt` | Read `name`, `value`, `min`, `max` for every parameter |
| `set_device_parameter` | `track_index`, `device_index`, `parameter_index`, `value` (`float`), `user_prompt` | Set parameter in Live units |

## Arrangement Timeline (6 tools)

| Tool | Parameters | Notes |
|---|---|---|
| `switch_to_arrangement_view` | `user_prompt` | Focus Arrangement view in Live |
| `set_arrangement_time` | `time` (`float`), `user_prompt` | Move Arrangement playhead (in beats) |
| `get_arrangement_clips` | `track_index`, `user_prompt` | List Arrangement clips on track |
| `duplicate_to_arrangement` | `track_index`, `clip_index`, `destination_time` (`float`), `user_prompt` | Copy Session clip to Arrangement beat position (`0.0` = bar 1, `8.0` = bar 3 in 4/4) |
| `set_arrangement_clip_name` | `track_index`, `clip_index`, `name`, `user_prompt` | Rename Arrangement clip |
| `create_locator` | `name`, `time` (`float`), `user_prompt` | Add/rename cue marker at beat position (capability-gated) |

## Telemetry & Dataset Preference (6 tools — Opt-In Only)

- `set_dataset_consent(consent, user_said="")` — Record opt-in/opt-out consent in `~/.ableton-mcp/consent.json`
- `submit_intent(text, level=5, user_prompt="")` — Record creative intent (levels `1–5`)
- `rate_last_action(rating, tags="", note="", user_prompt="")` — `better|same|worse|keep|reject|thumbs_up|thumbs_down`
- `prefer_candidate(candidate_a, candidate_b, winner, reason="", user_prompt="")` — Pairwise preference (`a`, `b`, or id)
- `reject_last_action(reason="", user_prompt="")` — Mark last edit rejected
- `record_audition(uri, kept=False, search_query="", dwell_ms=0.0, user_prompt="")` — Log browser/preset audition outcome
