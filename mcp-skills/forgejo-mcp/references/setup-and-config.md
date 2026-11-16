# `forgejo-mcp` Setup, Transports & Troubleshooting

## Installation Options

- **Go**: `go install git.b4mad.industries/agentic-forges/forgejo-mcp/v3@latest`
- **Container (`linux/amd64`, cosign-signed)**: `git.b4mad.industries/agentic-forges/forgejo-mcp:v3.1.0` (or `:latest`)
- **Binaries / AUR / Nix**: Git releases at `git.b4mad.industries/agentic-forges/forgejo-mcp/releases`, `yay -S forgejo-mcp`, or `nix run nixpkgs#forgejo-mcp` (unstable)

## Client Configurations

### `stdio` (local)

```json
{
  "mcpServers": {
    "forgejo": {
      "command": "forgejo-mcp",
      "args": ["--transport", "stdio", "--url", "https://your-forgejo-instance.org"],
      "env": {
        "FORGEJO_ACCESS_TOKEN": "<your-personal-access-token>"
      }
    }
  }
}
```

### Streamable HTTP (`--transport http`)

```bash
forgejo-mcp --transport http --url https://your-forgejo-instance.org
```

```json
{
  "mcpServers": {
    "forgejo": {
      "url": "http://localhost:8080/mcp",
      "headers": {
        "Authorization": "Bearer <your-personal-access-token>"
      }
    }
  }
}
```

## Critical Network & Auth Gotchas

- **HTTP/SSE requires per-request `Authorization` headers by default**: Requests without `Authorization: Bearer <token>` or `token <token>` get `401 Unauthorized`, even if `--token` is set on the server. Pass `--allow-operator-token-fallback` (`FORGEJO_MCP_ALLOW_OPERATOR_TOKEN_FALLBACK`) only for trusted single-user deployments where unauthenticated callers on the port may use the operator's token.
- **Rejected token error**: Forgejo token failures return JSON-RPC `-32004` (plus HTTP `401` with `WWW-Authenticate: Bearer error="invalid_token"` on `http` before streaming) with the token scrubbed from errors and logs.
- **Non-loopback `--host` requires `--allowed-hosts`**: By default `http`/`sse` bind `localhost` (`127.0.0.1` + `::1`). Binding `0.0.0.0` (such as inside a container) **refuses to start** unless `--allowed-hosts` (`FORGEJO_MCP_ALLOWED_HOSTS`) is set; mismatched `Host` headers get `403 Forbidden`. Browser clients also require `--allowed-origins` (`FORGEJO_MCP_ALLOWED_ORIGINS`).
- **Stream heartbeat**: `sse`/`http` send JSON-RPC `ping` every `30s` (`--heartbeat 0` disables) to prevent proxy/client idle timeouts.
- **OAuth 2.0 Resource Server (`--auth-mode resource-server`)**: Requires Forgejo 16.0+, an OIDC provider issuing JWTs with a user claim (`forgejo_aud`), public HTTPS origin, and a signing key (`--forgejo-jwt-signing-key-file`). See upstream `docs/oauth-resource-server/operator.md`.

## CLI Mode & Flags

Run any tool without starting an MCP server:

```bash
forgejo-mcp --cli list
forgejo-mcp --cli get_issue_by_index --args '{"owner":"org","repo":"app","index":1}'
```

| Flag | Env Var | Purpose |
| :--- | :--- | :--- |
| `--url` / `--token` | `FORGEJO_URL` / `FORGEJO_ACCESS_TOKEN` | Forgejo URL and PAT |
| `--transport` | — | `stdio`, `http`, or `sse` |
| `--http-port` / `--sse-port` | — | HTTP/SSE port (default `8080`) |
| `--host` / `--allowed-hosts` | `FORGEJO_MCP_HOST` / `FORGEJO_MCP_ALLOWED_HOSTS` | Bind address and allowed `Host` headers |
| `--allowed-origins` | `FORGEJO_MCP_ALLOWED_ORIGINS` | Allowed browser `Origin` headers |
| `--allow-operator-token-fallback` | `FORGEJO_MCP_ALLOW_OPERATOR_TOKEN_FALLBACK` | Allow HTTP/SSE requests without `Authorization` |
| `--heartbeat` | `FORGEJO_MCP_HEARTBEAT` | Stream keepalive ping interval (default `30s`) |
| — | `FORGEJO_MCP_ALLOW_FILE_PATH_UPLOAD` / `FORGEJO_MCP_UPLOAD_ROOT` | Enable and confine host `file_path` uploads |
| `--debug` | `FORGEJO_DEBUG` | Debug logging |
