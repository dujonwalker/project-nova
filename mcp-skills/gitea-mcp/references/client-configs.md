# Server Configuration, Flags & Client Snippets

## Flags & Environment Variables

Command-line flags take precedence over environment variables. Logs go to `stderr`.

| Flag | Env Var | Purpose |
| :--- | :--- | :--- |
| `-t`, `-transport` | `MCP_MODE` | Transport: `stdio` (default) or `http` |
| `-H`, `-host` | `GITEA_HOST` | Gitea base URL (default: `https://gitea.com`) |
| `-T`, `-token` | `GITEA_ACCESS_TOKEN` | Personal Access Token (or `GITEA_ACCESS_TOKEN_FILE`) |
| `-b`, `-bind` / `-p`, `-port` | — | HTTP listen address and port (default `8080`) |
| `-r`, `-read-only` | `GITEA_READONLY` | Hide all `Write` tools (`true` / `false`) |
| `-S`, `-scope` | `GITEA_SCOPES` | Comma-separated scopes to expose (e.g., `issue,pull_request`) |
| `-O`, `-tools` | `GITEA_TOOLS` | Comma-separated tool names to expose |
| `-k`, `-insecure` | `GITEA_INSECURE` | Skip TLS certificate verification (`true` / `false`) |
| `-ca-cert` | `GITEA_CA_CERT` | PEM CA bundle path (read once at startup) |
| `-client-cert` / `-client-key` | `GITEA_CLIENT_CERT` / `GITEA_CLIENT_KEY` | mTLS client cert & key (hot-reloaded on renewal; incompatible with `-oauth`) |
| `-gitea-unix-socket` | `GITEA_UNIX_SOCKET` | Connect via Unix socket (host defaults to `http://unix/`) |
| `-d`, `-debug` | `GITEA_DEBUG` | Log every Gitea HTTP request to `stderr` |
| — | `GITEA_EXTRA_HEADERS` | JSON object of extra headers (e.g., Cloudflare Access) |
| `-oauth` / `-oauth-public-url` | `GITEA_MCP_OAUTH` / `GITEA_MCP_PUBLIC_URL` | Enable OAuth 2.1 PKCE for `http` mode |

## Client Snippets

Replace `https://gitea.com` with your `GITEA_HOST` (add `-k` if using a self-signed certificate).

### Claude Code (`stdio` via `go run`)

```bash
claude mcp add --transport stdio --scope user gitea \
  --env GITEA_ACCESS_TOKEN=<your-token> \
  --env GITEA_HOST=https://gitea.com \
  -- go run gitea.com/gitea/gitea-mcp@latest -t stdio
```

### VS Code (`User Settings JSON` or `.vscode/mcp.json`)

For `.vscode/mcp.json`, omit the outer `"mcp"` wrapper key and place `"inputs"` and `"servers"` at the top level.

```json
{
  "mcp": {
    "inputs": [
      {
        "type": "promptString",
        "id": "gitea_token",
        "description": "Gitea Personal Access Token",
        "password": true
      }
    ],
    "servers": {
      "gitea-mcp": {
        "command": "docker",
        "args": [
          "run", "-i", "--rm",
          "-e", "GITEA_ACCESS_TOKEN",
          "-e", "GITEA_HOST",
          "docker.gitea.com/gitea-mcp-server"
        ],
        "env": {
          "GITEA_HOST": "https://gitea.com",
          "GITEA_ACCESS_TOKEN": "${input:gitea_token}"
        }
      }
    }
  }
}
```

### OpenCode

```json
{
  "gitea-mcp": {
    "enabled": true,
    "type": "local",
    "command": [
      "gitea-mcp",
      "-t", "stdio",
      "-H", "https://gitea.com",
      "-T", "<your-personal-access-token>"
    ]
  }
}
```

### Mistral Vibe (`~/.vibe/config.toml`)

```toml
[[mcp_servers]]
name = "gitea"
transport = "stdio"
command = "docker"
args = ["run", "--rm", "-i", "-e", "GITEA_ACCESS_TOKEN", "-e", "GITEA_HOST", "docker.gitea.com/gitea-mcp-server"]

[mcp_servers.env]
GITEA_ACCESS_TOKEN = "TOKEN"
GITEA_HOST = "https://gitea.com"
```

### Cursor & Generic `mcpServers` (`stdio` & Stateless `http`)

```json
{
  "mcpServers": {
    "gitea": {
      "command": "gitea-mcp",
      "args": ["-t", "stdio", "-H", "https://gitea.com"],
      "env": {
        "GITEA_ACCESS_TOKEN": "<your-personal-access-token>"
      }
    }
  }
}
```

For stateless `http` mode (`gitea-mcp -t http -p 8080 -H https://gitea.com`):

```json
{
  "mcpServers": {
    "gitea": {
      "url": "http://localhost:8080/mcp",
      "headers": {
        "Authorization": "Bearer <your-personal-access-token>"
      }
    }
  }
}
```

## HTTP Transport & OAuth 2.1 Gotchas

- **Stateless HTTP only**: `/mcp` accepts `POST` only — no `Mcp-Session-Id`, no standalone SSE, no `Last-Event-ID` resumability. `/healthz` serves health probes.
- **Reverse proxy headers**: Forward `Mcp-Protocol-Version`, `Mcp-Method`, and `Mcp-Name` unchanged.
- **Token passthrough**: HTTP mode accepts `Authorization: Bearer <token>` or `Authorization: token <token>` per request and returns `401` if Gitea rejects the credential.
- **Docker read-only rootfs**: Mount a `tmpfs` at `/tmp` for the built-in `-healthcheck`.
- **OAuth 2.1 PKCE**: Gitea has no dynamic client registration. Register an OAuth2 app in **Settings → Applications → Create OAuth2 Application** with **Confidential Client unchecked**. Add redirect URIs (`https://claude.ai/api/mcp/auth_callback`, `http://127.0.0.1/callback`), start with `gitea-mcp -t http -oauth -oauth-public-url https://mcp.example.com -H https://gitea.example.com`, and ensure proxies preserve `Host` matching `-oauth-public-url` (or loopback).
