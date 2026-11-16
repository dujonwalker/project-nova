# `reaper-mcp` Setup & Architecture

## Architecture Overview

Unlike network-socket DAW bridges, `xdarkzx-reaper-mcp` (v0.8.3) runs as a **`stdio` MCP server** communicating with REAPER over a **local file-based IPC directory**:

- Python MCP server entrypoint: `reaper-mcp` (`reaper_mcp.main:main`), transport `stdio` only.
- REAPER side: `reaper_scripts/reaper_mcp_server.lua` running inside REAPER (started manually via *Actions → Load ReaScript* or automatically via `__startup.lua`).
- Shared IPC directory: `<system_temp>/reaper_mcp/` containing `command.json`, `response.json`, `ipc.mutex`, `server.lock`, `generations/`, and `history/`.
  - `COMMAND_TIMEOUT = 30.0s`, `LONG_COMMAND_TIMEOUT = 600.0s`, Lua heartbeat staleness threshold = `60s`.

> **Critical Deployment Constraint (Same-OS Filesystem Required):**
> The Python `reaper-mcp` process and the REAPER application running `reaper_mcp_server.lua` **must share the same OS temp directory** (`$TMPDIR/reaper_mcp` on Linux/macOS, `%TEMP%\reaper_mcp` on Windows). Running `reaper-mcp` inside WSL while REAPER runs on Windows fails because the two environments do not share the same temp filesystem.

## Installation Notes

1. Install Python `>=3.10` package:
   - Base server: `pip install xdarkzx-reaper-mcp`
   - With offline WAV analysis (`analyze_*` tools): `pip install "xdarkzx-reaper-mcp[analysis]"` (`numpy`, `soundfile`, `pyloudnorm`)
2. Install `reaper_scripts/reaper_mcp_server.lua` in REAPER's `Scripts/` directory (grab it from the `xDarkzx/Reaper-MCP` repository — it is not bundled in the PyPI wheel) and register it in REAPER Actions or `__startup.lua`.

## Environment Variables & CLI Flags

- `REAPER_MCP_PROFILE`: Built-in profile name (`full`, `composition`, `production`, `mixing`, `analysis`, `minimal`; defaults to `full`).
- `REAPER_MCP_PROFILE_FILE`: Path to a custom TOML/JSON profile file overriding the preset.
- `REAPER_MCP_INCLUDE_MODULES` / `REAPER_MCP_EXCLUDE_MODULES`: Comma-separated module filter overrides (e.g., `transport_tools,track_tools`).
- `REAPER_MCP_INCLUDE_TOOLS` / `REAPER_MCP_EXCLUDE_TOOLS`: Comma-separated tool filter overrides.
- `REAPER_MCP_NO_SUPERSEDE`: Disable automatic generation superseding when multiple MCP client processes share the same IPC directory.
- `--profile-info`: Print active profile tool count, module list, and character footprint without starting the MCP server.
