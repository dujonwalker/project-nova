# Rust MCP Filesystem Setup & Configuration

Configuration and deployment reference for `rust-mcp-filesystem` (`v0.4.5`, MIT).

## Transport Architecture

`rust-mcp-filesystem` compiles `rust-mcp-sdk` with `stdio` transport only (`StdioTransport`). It does **not** include a built-in HTTP or SSE listener (`--port` / `--host` do not exist).

- **Local `stdio` client**: Run the binary (or `docker run -i --rm ...`) directly via stdin/stdout.
- **Remote / shared HTTP `/mcp` container**: Wrap the binary with an HTTP-to-stdio MCP proxy (such as `supergateway` or `mcp-proxy`) inside the container image or entrypoint so remote MCP clients can connect over Streamable HTTP (`/mcp`).

## CLI Flags & Environment Variables

```text
Usage: rust-mcp-filesystem [OPTIONS] [ALLOWED_DIRECTORIES]...
```

| Flag | Env Variable | Default | Behavior |
|---|---|---|---|
| `<ALLOWED_DIRECTORIES>...` | — | Required unless `-t` | Space-separated directory paths permitted for operations |
| `-w`, `--allow-write` | `ALLOW_WRITE` | `false` | Enables the 7 write/archive tools (`write_file`, `edit_file`, `create_directory`, `move_file`, `zip_files`, `unzip_file`, `zip_directory`) |
| `-t`, `--enable-roots` | `ENABLE_ROOTS` | `false` | Allows MCP clients supporting Roots to dynamically replace allowed directories |
| `-d`, `--disable-tools <LIST>` | `DISABLE_TOOLS` | None | Comma-separated, case-insensitive list of tool names to hide and block (validated against the 24 real tool names at startup) |

> **CLI Flag Notes**:
> - Startup fails if any name in `--disable-tools` is not one of the 24 registered tools (for example, `delete_file` does not exist and fails validation).
> - If `--enable-roots` is omitted and no `<ALLOWED_DIRECTORIES>` are given, the server exits immediately.
> - If `--enable-roots` is enabled without fallback directories and the MCP client does not support Roots (or sends an empty list), the server exits or cannot operate.

## Client Configuration Examples

### Local Binary (`stdio`, read-only)

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "rust-mcp-filesystem",
      "args": ["/path/to/allowed/dir1", "/path/to/allowed/dir2"]
    }
  }
}
```

### Local Binary (`stdio`, read-write with `zip` disabled)

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "rust-mcp-filesystem",
      "args": [
        "-w",
        "-d", "zip_files,zip_directory,unzip_file",
        "/path/to/workspace"
      ]
    }
  }
}
```

### Docker Notes

- Upstream `Dockerfile` builds a static musl binary on `alpine:latest` running as non-root user `rust-mcp-user` with `ENTRYPOINT ["./rust-mcp-filesystem"]`.
- Mount host paths into the container (`-v /host/data:/data:ro` for read-only, or `:rw` when pairing with `-w`) and ensure `rust-mcp-user` has filesystem read/write permissions on the mounted directories.
- Because the upstream image only speaks `stdio`, use `docker run -i --rm ...` for local `stdio` clients or add an HTTP-to-stdio MCP proxy layer when exposing a network `/mcp` port.
