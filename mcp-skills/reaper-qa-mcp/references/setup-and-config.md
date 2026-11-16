# `reaper-qa-mcp` Setup & Architecture

## Architecture

[`dschuler36/reaper-mcp-server`](https://github.com/dschuler36/reaper-mcp-server) (`v0.1.0`, MIT, Python `>=3.10`) is an **offline, read-only** MCP server (`FastMCP("reaper-mcp-server")`, native `stdio` transport). It does **not** require REAPER to be running or any ReaScript bridge; it inspects `.RPP` project files, REAPER plugin `.ini` caches, and audio files directly from disk.

## Configuration & Path Behavior

- **`--reaper-projects-dir <dir>`**: Required base directory for project discovery (`find_reaper_projects`) and symlink-safe confinement (`resolve_project_path` rejects any path resolving outside `--reaper-projects-dir` or not ending in `.rpp`).
- **Audio file resolution (`analyze_audio_files`)**: Reads exact `FILE` paths referenced by items inside `.RPP` files. If `.RPP` files reference absolute paths from another OS or workstation, disk reads will fail unless paths match the server's filesystem.
- **REAPER resource directory (`list_installed_fx`)**: Checks default OS REAPER resource paths (`~/Library/Application Support/REAPER` on macOS, `~/.config/REAPER` on Linux, `%APPDATA%\REAPER` on Windows). Plugin caches only reflect plugins previously scanned inside REAPER.

## Dependencies

`mcp>=1.2.0,<2`, `soundfile>=0.12.1`, `numpy>=1.24.0`, `scipy>=1.10.0`, `pyloudnorm>=0.1.1`.

## Local `stdio` Example

```json
{
  "mcpServers": {
    "reaper-qa-mcp": {
      "command": "uvx",
      "args": [
        "--from",
        "git+https://github.com/dschuler36/reaper-mcp-server",
        "reaper-mcp-server",
        "--reaper-projects-dir",
        "/path/to/reaper/projects"
      ]
    }
  }
}
```
