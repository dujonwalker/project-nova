# Media & Creative Tools Agents

This manual covers all media and creative tools agents in Project NOVA, their capabilities, tools, and example usage patterns.

## Ableton Copilot

**Description**: Assists with music production in Ableton Live.

### Available Tools
- Tools for interacting with Ableton Live (Note: specific tools weren't detailed in the system prompt)

### Example Queries
- "Help me set up a new project in Ableton"
- "What's the best way to mix my drums?"
- "Show me how to create a sidechain compression effect"
- "What are some good Ableton workflow tips?"
- "How do I automate parameters in my track?"

### Troubleshooting
- If specific features aren't available, the agent will provide general advice based on Ableton knowledge
- For detailed operation, may need to clarify project requirements and specifics

---

## OBS Agent

**Description**: Controls OBS Studio for streaming and recording.

### Available Tools
**General Operations**
- `obs-get-version`, `obs-get-stats`, `obs-broadcast-custom-event`
- `obs-call-vendor-request`, `obs-get-hotkey-list`, `obs-trigger-hotkey-by-name`
- `obs-trigger-hotkey-by-key-sequence`, `obs-sleep`
- `obs-get-persistent-data`, `obs-set-persistent-data`

**Scene Management**
- `obs-get-scene-list`, `obs-get-current-scene`, `obs-set-current-scene`
- `obs-get-preview-scene`, `obs-set-preview-scene`, `obs-create-scene`
- `obs-remove-scene`, `obs-get-scene-collection-list`
- `obs-set-current-scene-collection`, `obs-create-scene-collection`

**Source and Input Control**
- `obs-get-source-active`, `obs-get-source-screenshot`, `obs-save-source-screenshot`
- `obs-get-input-list`, `obs-get-input-kind-list`, `obs-get-special-inputs`
- `obs-create-input`, `obs-remove-input`, `obs-set-input-name`
- Many more input-related functions

**Audio Control**
- `obs-get-input-mute`, `obs-set-input-mute`, `obs-toggle-input-mute`
- `obs-get-input-volume`, `obs-set-input-volume`
- Audio balance, sync, and monitoring functions

**Scene Item Manipulation**
- `obs-get-scene-items`, `obs-create-scene-item`, `obs-remove-scene-item`
- `obs-set-scene-item-enabled`, `obs-get-scene-item-transform`
- `obs-set-scene-item-transform`, `obs-get-scene-item-id`

**Streaming and Recording**
- `obs-get-stream-status`, `obs-start-stream`, `obs-stop-stream`, `obs-toggle-stream`
- `obs-get-record-status`, `obs-toggle-record`, `obs-start-record`, `obs-stop-record`
- Functions for pause, resume, split, chapter creation

**Virtual Camera and Replay Buffer**
- Controls for virtual camera and replay buffer

**Transitions, Profiles, Output, Studio Mode, Filters, Media Control, Projectors**
- Comprehensive set of functions for all OBS features

### Example Queries
- "Start my stream on OBS"
- "Switch to my gaming scene"
- "Mute my microphone input"
- "Start recording my screen"
- "Create a new scene called 'Intro'"
- "Add a browser source to my current scene"
- "Adjust the volume of my music source to 50%"
- "Take a screenshot of my current scene"
- "Toggle my webcam on and off"
- "Set up a transition between my scenes"

### Troubleshooting
- Ensure OBS is running with WebSocket server enabled
- Check for password authentication problems
- Verify resource names are correct (case-sensitive)
- For operation failures, check permissions or conflicting operations

---

## Reaper Agent

**Description**: Controls REAPER digital audio workstation.

### Available Tools
- `create_project`: Creates a new REAPER project
- `create_track`: Creates a new track in the current project
- `list_tracks`: Lists all tracks in the current project
- `add_midi_note`: Adds a MIDI note to a track
- `get_project_info`: Gets information about the current project

### Example Queries
- "Create a new rock song project"
- "Add a drum track to my project"
- "Create a C major chord at the beginning of the piano track"
- "Add a 4-bar drum pattern"
- "Show me all the tracks in my current project"
- "Add a bassline that follows the chord progression"
- "Get information about my current project"

### Troubleshooting
- Agent can only use the 5 functions listed above
- Cannot directly modify tempo, add effects, or adjust volume
- For complex music creation, multiple steps may be needed
- Verify track indices before adding MIDI notes

---

## Reaper QA Agent

**Description**: Analyzes and answers questions about REAPER projects.

### Available Tools
- `find_reaper_projects`: Locates all Reaper projects in configured directory
- `parse_reaper_project`: Analyzes a specific project file and returns detailed information

### Example Queries
- "What Reaper projects do I have?"
- "Tell me about my 'Song Demo' project"
- "What effects am I using on the vocal track in my 'Live Session' project?"
- "How many tracks are in my latest project?"
- "What's the BPM of my 'Drum Loop' project?"
- "Show me the automation data in my project"
- "Which plugins am I using in my mix?"

### Troubleshooting
- Verify project names match exactly what's shown by `find_reaper_projects`
- Check if project files exist in the configured directory
- For complex projects, parsing may take longer
- If specific data seems missing, it may not be included in the project file

---

## YouTube Agent

**Description**: Transcribes YouTube videos for summarization and content analysis.

### Available Tools
- `get_transcript`: Extracts transcript from YouTube video
  - Parameters:
    - `video_id`: YouTube video ID or URL (required)
    - `with_timestamps`: Boolean to include timestamps (default: false)
    - `language`: Language code (default: "en" for English)

### Example Queries
- "Transcribe this YouTube video: https://youtube.com/watch?v=abcdefghijk"
- "Summarize what this YouTube video is about"
- "Extract the main points from this YouTube lecture"
- "Find all mentions of 'climate change' in this video"
- "Get the transcript with timestamps so I can find a specific section"
- "Transcribe this YouTube video in Spanish"

### Troubleshooting
- Not all videos have available transcripts (private videos, no captions)
- Some transcripts may contain errors, especially with poor audio quality
- Auto-generated transcripts may not distinguish between speakers
- The agent can only access the transcript, not audio or visual content
