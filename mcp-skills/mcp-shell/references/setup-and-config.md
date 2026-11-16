# `mcp-shell` Setup & Security Model

Upstream repository: [`sonirico/mcp-shell`](https://github.com/sonirico/mcp-shell) (`v1.1.1`, Go `1.26`, `mark3labs/mcp-go`).

## Transport & Runtime

- Upstream serves over **`stdio`** (`server.ServeStdio`) as non-root `mcpuser` (`1000:1000`, Alpine `WORKDIR /tmp/mcp-workspace`).

## Modes & `security.yaml` Precedence

| Setting | Secure Mode (default) | Unrestricted Mode (`MCP_SHELL_ALLOW_UNSAFE=1`) |
| :--- | :--- | :--- |
| Tool surface | Typed FS/Git/`run_script` tools | `shell_exec` only (`bash -c`) |
| Path validation / `.git` write block | Enforced (`workspace.resolve` / `resolveForWrite`) | None |
| Child environment | Minimal (`PATH`, `HOME`, `LANG=C`, plus git config vars) | Inherits server environment |
| Linux Landlock V5 (`sandbox: true`) | `RODirs("/")`, `RWDirs(workspace)`, `RWFiles("/dev/null")`, no TCP bind/connect (`.BestEffort()` degrades on unsupported kernels) | Disabled |
| `max_execution_time` (`30s` default) | Enforced | Enforced |
| `max_output_size` (`1048576` bytes default, per stream) | Enforced | Enforced |
| `working_directory` (`/tmp` default) | Enforced & created if missing | Created if missing & set as `cmd.Dir` |
| `run_as_user` | Enforced if set | Enforced if set |

> **Config Precedence Warning:** Setting `MCP_SHELL_ALLOW_UNSAFE=1` alongside a YAML config file containing `security.enabled: true` overrides the env var back to secure mode. Unrestricted deployments loading a YAML config must explicitly set `security.enabled: false` (which startup refuses unless `MCP_SHELL_ALLOW_UNSAFE=1` is also set).

## Environment Variables

- `MCP_SHELL_SEC_CONFIG_FILE`: Path to security YAML config file.
- `MCP_SHELL_ALLOW_UNSAFE`: Set `1` or `true` to enable `shell_exec` mode.
- `MCP_SHELL_SERVER_NAME`: Override server name (default `"mcp-shell 🐚"`).
- `MCP_SHELL_LOG_LEVEL`: `debug`, `info`, `warn`, `error`, `fatal`.
- `MCP_SHELL_LOG_FORMAT`: `json`, `console`.
- `MCP_SHELL_LOG_OUTPUT`: `stdout`, `stderr`, `file`.

## Removed `0.x` Keys (Error on Startup)

`use_shell_execution`, `allowed_executables`, `allowed_commands`, `blocked_commands`, and `blocked_patterns` were removed in `1.0.0` and cause a startup failure if present in `security.yaml`.
