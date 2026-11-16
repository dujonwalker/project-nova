# Ableton MCP Setup & Configuration

Configuration, networking, and telemetry reference for [`ahujasid/ableton-mcp`](https://github.com/ahujasid/ableton-mcp) (`v1.4.5`, MIT, Python `>=3.10`).

## Two-Part Architecture

1. **Ableton Remote Script** (`AbletonMCP_Remote_Script/__init__.py`, `v1.7.1`): Runs inside Ableton Live 10+ as a Control Surface MIDI Remote Script and opens an unauthenticated TCP JSON socket server (`9877`).
2. **MCP Server** (`MCP_Server/server.py`): Connects to the Remote Script over TCP (`ABLETON_HOST:ABLETON_PORT`) and speaks **MCP `stdio`** (`mcp.run()`).

## Installing & Enabling the Remote Script (Ableton Host)

On the machine running Ableton Live:

```bash
uvx --from ableton-mcp ableton-mcp-install-script --list-targets
uvx --from ableton-mcp ableton-mcp-install-script
```

Then in **Ableton Live**:
1. Open **Settings / Preferences → Link, Tempo & MIDI**.
2. Under **Control Surface**, select **AbletonMCP**.
3. Leave **Input** and **Output** set to **None**.
4. Restart Ableton Live after upgrading `ableton-mcp` so the Remote Script version stays in sync (`get_remote_script_info`).

## Environment Variables & Remote Networking

| Component | Variable | Default | Notes |
|---|---|---|---|
| MCP Server | `ABLETON_HOST` | `localhost` | Hostname/IP of machine running Ableton Live |
| MCP Server | `ABLETON_PORT` | `9877` | TCP port of the Remote Script |
| Remote Script (inside Live) | `ABLETON_MCP_HOST` | `127.0.0.1` | Bind address inside Live; defaults to loopback for security |
| MCP Server | `ABLETON_MCP_DISABLE_TELEMETRY` | unset (`false`) | Set `"true"` to disable anonymous usage telemetry AND dataset recording (`DISABLE_TELEMETRY=true` / `MCP_DISABLE_TELEMETRY=true` also work) |
| MCP Server | `ABLETON_MCP_ENABLE_DATASET` | unset (`false`) | Explicitly opt in to dataset trajectory recording |
| MCP Server | `ABLETON_MCP_DISABLE_DATASET` | unset (`false`) | Force-disable dataset recording only |

> **Important Remote / Docker Networking Note**:
> - Because `AbletonMCP_Remote_Script` defaults to `127.0.0.1:9877`, a remote Docker container cannot reach Ableton Live unless you either:
>   1. Launch Ableton Live with `ABLETON_MCP_HOST=0.0.0.0` (on a trusted LAN + host firewall allowing port `9877`) and set `ABLETON_HOST=<ableton-host-ip>` on the MCP container, **or**
>   2. Forward `9877` between the Ableton host and MCP container via an SSH/TCP relay.
> - Because `AbletonMCP` TCP commands are unauthenticated and can import paths or drive the DAW, never expose port `9877` on untrusted networks.
> - Because `MCP_Server/server.py` runs `stdio` natively, exposing a `/mcp` HTTP endpoint in Docker requires wrapping it with an HTTP-to-stdio MCP proxy (such as `mcp-proxy` or `supergateway`).

## Local `stdio` Client Example

```json
{
  "mcpServers": {
    "AbletonMCP": {
      "command": "uvx",
      "args": ["ableton-mcp"],
      "env": {
        "ABLETON_MCP_DISABLE_TELEMETRY": "true"
      }
    }
  }
}
```
