---
name: filesystem-mcp
description: Explore, search, read, edit, organize, and archive files inside sandboxed directories via `rust-mcp-filesystem` MCP tools (`filesystem-mcp`) — list directories, inspect trees, read text/lines/media, search filenames and regex file contents, calculate directory sizes, find duplicates or empty folders, apply diff-style edits, and zip/unzip archives. Use whenever filesystem operations should run against allowed MCP directories rather than ad-hoc shell commands, respecting read-only defaults unless write mode (`-w`/`--allow-write`) is enabled. Do not use for indexed NAS search stacks, web URL fetching, or raw block-device/host mount capacity troubleshooting.
---

# Rust MCP Filesystem

Operate safely inside explicitly allowed filesystem roots exposed by `rust-mcp-filesystem` (`v0.4.5`). The server exposes 24 tools (17 read/search/analysis tools + 7 write/archive tools) and runs **read-only by default** unless launched with `-w` / `--allow-write`.

## Core Workflow

1. **Discover allowed scope**: Call `list_allowed_directories` before accessing paths so all targets stay inside permitted directories.
2. **Orient cheaply**: Use `list_directory`, `list_directory_with_sizes`, `directory_tree` (pass `max_depth` on deep trees), or `get_file_info` before reading large files.
3. **Search & locate**:
   - Use `search_files` (glob `pattern`, optional `excludePatterns`, `min_bytes`, `max_bytes`) to find paths.
   - Use `search_files_content` (glob `pattern`, `query`, `is_regex`, `excludePatterns`) for literal or regex content matches with line/column numbers.
4. **Read selectively**:
   - Prefer `head_file`, `tail_file`, or `read_file_lines` (0-based `offset` + optional `limit`) on large logs or files.
   - Use `read_text_file` (`with_line_numbers: true` when preparing edits) or `read_multiple_text_files` for batch reads; use `read_media_file` / `read_multiple_media_files` (with `max_bytes`) for images/audio.
5. **Modify safely (requires `-w` / `--allow-write`)**:
   - Prefer `edit_file` (`edits: [{oldText, newText}]`, `dryRun: true` first when risky, `replaceAll` only when intended) over `write_file` (which overwrites existing files without warning).
   - Use `create_directory`, `move_file`, `zip_files`, `zip_directory`, and `unzip_file` only when write mode is active.

## Guardrails

- Never assume write access is enabled; if a write/archive tool fails with a read-only error, report that `-w` / `--allow-write` (or `ALLOW_WRITE=true`) is required on the server.
- Watch parameter casing across tools: `search_files` and `search_files_content` take `excludePatterns`, whereas `find_duplicate_files` and `find_empty_directories` take `exclude_patterns`.
- Note there is no built-in file deletion tool; use `move_file` or inspect allowed operations rather than guessing a `delete_file` tool.
- Honor `--disable-tools`: disabled tools are omitted from `tools/list` and rejected if called.

## References

- [references/tools-reference.md](references/tools-reference.md): All 24 tools with exact parameter names, types, defaults, and read-only vs write-mode classification.
- [references/setup-and-config.md](references/setup-and-config.md): CLI flags (`-w`, `-t`, `-d`), env vars, Docker permissions, MCP Roots behavior, and HTTP-to-stdio bridge notes.
