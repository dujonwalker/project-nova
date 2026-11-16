# Memos Native MCP Setup & Troubleshooting

Memos serves its built-in stateless Streamable HTTP MCP endpoint directly at **`/mcp`** (no separate MCP container or `stdio` wrapper required).

## Client Configuration

Create a Personal Access Token in Memos (**Settings → My Account → Access Tokens**) and connect your MCP client:

```json
{
  "mcpServers": {
    "memos-mcp": {
      "url": "https://<your-memos-instance>/mcp",
      "headers": {
        "Authorization": "Bearer <your-personal-access-token>"
      }
    }
  }
}
```

(In clients like Claude Code / VS Code, add `"type": "http"` if required by the client schema.)

## Server Behavior & Troubleshooting

- **Stateless Streamable HTTP**: `/mcp` runs in stateless JSON-response mode (no SSE stream, no `Mcp-Session-Id` tracking). Reverse proxies forwarding protocol version `2026-07-28` should pass `Mcp-Protocol-Version`, `Mcp-Method`, and `Mcp-Name` unchanged.
- **Auth forwarding**: Your `Authorization: Bearer <token>` header is passed to the in-process Memos REST handler. Mutating tools and private reads require a valid token; public reads behave like the public API.
- **403 Forbidden (`Origin` check)**: Memos allows requests when `Origin` is absent, when `Origin`'s host matches the request `Host` header, or when `Origin` matches `profile.InstanceURL`. Other origins are rejected with `403` to prevent browser DNS-rebinding.
- **Body limit**: `/mcp` allows request bodies up to `256 MiB` (matching Memos's API limit for attachment uploads).
