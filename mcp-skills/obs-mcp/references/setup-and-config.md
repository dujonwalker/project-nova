# OBS MCP Setup & Configuration

Configuration and deployment reference for [`xDarkzx/OBS_MCP`](https://github.com/xDarkzx/OBS_MCP) (`obs-mcp` `v0.2.0`, Apache-2.0, Python `>=3.10`).

## Prerequisites in OBS Studio

OBS Studio **28+** ships `obs-websocket` v5 built in:

1. Open **OBS Studio**.
2. Go to **Tools → WebSocket Server Settings**.
3. Enable **Enable WebSocket server** (default port `4455`).
4. If authentication is enabled, inspect **Show Connect Info** for the exact password.

> When running `obs-mcp` on a different host or inside Docker, ensure OBS Studio's machine firewall allows inbound TCP on port `4455` from the MCP server host and set `OBS_HOST` to that OBS machine's reachable IP/hostname.

## Environment Variables

| Variable | Default | Purpose |
|---|---|---|
| `OBS_HOST` | `localhost` | Hostname or IP running OBS Studio's WebSocket server |
| `OBS_PORT` | `4455` | `obs-websocket` v5 TCP port |
| `OBS_PASSWORD` | `""` (empty) | Authentication password (leave empty if disabled in OBS) |

## Transport Architecture

`obs_mcp/main.py` initializes `FastMCP("obs-mcp")` and calls `mcp.run()`, which runs **`stdio` transport** by default.

- **Local `stdio` client (`pip install obs-mcp` or `uvx obs-mcp`)**:

```json
{
  "mcpServers": {
    "obs-mcp": {
      "command": "uvx",
      "args": ["obs-mcp"],
      "env": {
        "OBS_HOST": "localhost",
        "OBS_PORT": "4455",
        "OBS_PASSWORD": ""
      }
    }
  }
}
```

- **Remote / containerized HTTP `/mcp` deployment**: Wrap `obs-mcp` with an HTTP-to-stdio MCP bridge (such as `mcp-proxy` or `supergateway`) inside a container with `OBS_HOST`, `OBS_PORT`, and `OBS_PASSWORD` configured so remote MCP clients can connect over `/mcp`.

## Operational & Troubleshooting Notes

- **Dependency constraint**: `pyproject.toml` pins `mcp[cli]>=1.0.0,<2.0.0` because `mcp` 2.x changed `mcp.server.fastmcp` imports.
- **Password log suppression**: `obs_mcp/main.py` raises `obsws_python` logger level to `WARNING` so connection passwords are never printed to stderr.
- **Connection errors**: `OBSClient` connects lazily on first tool call with a 5s timeout, serializes concurrent calls with an `asyncio.Lock` (required because `obsws-python` is single-request on a socket), and automatically resets the socket on disconnect so the next call reconnects cleanly.
- **Blocking OBS dialogs**: If a tool call hangs, check OBS Studio on desktop for modal prompts (for example, scene-collection changes) blocking the OBS thread.
