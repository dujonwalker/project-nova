---
name: mcp-shell
description: Execute shell commands (`shell_exec`), inspect local Git repositories, or run typed filesystem and operator-defined script tools inside the target environment via the `mcp-shell` MCP server (`sonirico/mcp-shell`). Use when asked to run shell/CLI commands on an `mcp-shell` host (e.g., `shell_exec` in `MCP_SHELL_ALLOW_UNSAFE=1` mode with `base64` support for binary output), or use its secure-mode typed filesystem, Git, and `run_script` tools when secure mode is active. Do not use for plain workspace file management better handled by `filesystem-mcp`, remote Git hosting API operations, or local DAW/browser/OBS control.
---

# Shell & Workspace Execution (`mcp-shell`)

Interact with the `mcp-shell` MCP server (`sonirico/mcp-shell` `v1.1.1`). Available tools depend on server configuration:

- **Unrestricted mode (`MCP_SHELL_ALLOW_UNSAFE=1`):** Exposes **`shell_exec(command, base64=false)`** only, running `bash -c <command>` in `working_directory`.
- **Secure mode (`security.enabled: true`, default):** Exposes **18–29 typed tools** (read/search FS, local Git, opt-in writes, opt-in `run_script`) with no raw `shell_exec`.

## Operating Guidelines

1. **Respect active mode & limits:**
   - When `shell_exec` is active, keep commands concise, non-interactive, and within `max_execution_time` and `max_output_size` (which cap stdout and stderr independently and cancel the process on overflow).
   - Set `base64=true` on `shell_exec` when stdout/stderr may contain binary bytes.
   - Confirm destructive filesystem, Git, or container/service commands before executing unless explicitly instructed.
2. **When secure mode is active:**
   - Use typed `git_*` and filesystem tools (`read_file`, `glob`, `grep`, `diff_files`) or `run_script(name)` directly; all paths resolve relative to `working_directory` (with `.git` writes blocked).
3. **Choose the right server:**
   - Prefer `mcp-shell` when a task needs shell pipelines, CLI utilities, runtime/process inspection, or local workspace Git tools via MCP; prefer `filesystem-mcp` for standalone workspace file CRUD when no shell execution is needed.

## References

- Unrestricted `shell_exec` & secure-mode typed tool catalog: [references/tools-reference.md](references/tools-reference.md)
- Modes, `security.yaml` enforcement rules, and Landlock sandbox behavior: [references/setup-and-config.md](references/setup-and-config.md)
