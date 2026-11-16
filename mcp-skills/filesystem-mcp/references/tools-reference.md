# Rust MCP Filesystem Tools Reference

All 24 tools exposed by `rust-mcp-filesystem` (`v0.4.5`). Every path argument must reside within directories returned by `list_allowed_directories`.

## Directory & Metadata Inspection (Read-Only — 5 tools)

| Tool | Required Parameters | Optional Parameters & Defaults | Notes |
|---|---|---|---|
| `list_allowed_directories` | — | — | Returns permitted root paths (call first when unsure of root paths) |
| `list_directory` | `path` | — | Entries prefixed with `FILE` / `DIR` |
| `list_directory_with_sizes` | `path` | — | Same as `list_directory`, plus file sizes |
| `directory_tree` | `path` | `max_depth` (`u64`) | Recursive JSON tree (`name`, `type`, `children`); sets meta `warning` if truncated by `max_depth` |
| `get_file_info` | `path` | — | Metadata: size, created/modified timestamps, permissions, type |

## Reading Text & Media (Read-Only — 7 tools)

| Tool | Required Parameters | Optional Parameters & Defaults | Notes |
|---|---|---|---|
| `read_text_file` | `path` | `with_line_numbers` (`bool`, default `false`) | Prefixes lines as `  123 \| <line>` when `with_line_numbers: true` |
| `read_multiple_text_files` | `paths` (`string[]`) | — | Batch read; individual file failures do not abort the batch |
| `head_file` | `path`, `lines` (`u64`) | — | First `N` lines of a text file |
| `tail_file` | `path`, `lines` (`u64`) | — | Last `N` lines of a text file |
| `read_file_lines` | `path`, `offset` (`u64`) | `limit` (`u64`) | Skips `offset` lines (0-based), reads up to `limit` lines or EOF |
| `read_media_file` | `path` | `max_bytes` (`u64`) | Returns Base64 + inferred image/audio MIME type; errors if size exceeds `max_bytes` |
| `read_multiple_media_files` | `paths` (`string[]`) | `max_bytes` (`u64`) | Batch image/audio read; skips failed files |

## Search & Directory Analysis (Read-Only — 5 tools)

| Tool | Required Parameters | Optional Parameters & Defaults | Notes |
|---|---|---|---|
| `search_files` | `path`, `pattern` (glob) | `excludePatterns` (`string[]`), `min_bytes` (`u64`), `max_bytes` (`u64`) | Case-insensitive recursive filename/dir search |
| `search_files_content` | `path`, `pattern` (glob), `query` | `is_regex` (`bool`, default `false`), `excludePatterns` (`string[]`), `min_bytes` (`u64`), `max_bytes` (`u64`) | Returns `file`, `line:col`, and matched line preview |
| `calculate_directory_size` | `root_path` | `output_format` (`"human-readable"` \| `"bytes"`, default `"human-readable"`) | Recursive directory byte sum |
| `find_empty_directories` | `path` | `exclude_patterns` (`string[]`), `output_format` (`"text"` \| `"json"`, default `"text"`) | Ignores `.DS_Store` and `Thumbs.db` |
| `find_duplicate_files` | `root_path` | `pattern`, `exclude_patterns` (`string[]`), `min_bytes` (default `1`), `max_bytes`, `output_format` (`"text"` \| `"json"`, default `"text"`) | Groups identical files by content hash |

> **Casing reminder**: `search_files` and `search_files_content` use camelCase `excludePatterns`, whereas `find_empty_directories` and `find_duplicate_files` use snake_case `exclude_patterns`.

## File Modification & Archives (Write Mode Required — 7 tools)

All 7 tools below require `-w` / `--allow-write` (`ALLOW_WRITE=true`); otherwise the server rejects calls with a read-only error.

| Tool | Required Parameters | Optional Parameters & Defaults | Notes |
|---|---|---|---|
| `edit_file` | `path`, `edits` (`[{oldText, newText}]`) | `dryRun` (`bool`), `replaceAll` (`bool`, default `false`) | Line-based exact replacement returning a git-style diff; errors on multiple matches unless `replaceAll: true` |
| `write_file` | `path`, `content` | — | Creates new file or **overwrites** existing file completely |
| `create_directory` | `path` | — | Creates directory and missing parents silently if already present |
| `move_file` | `source`, `destination` | — | Moves or renames files/dirs; fails if `destination` already exists |
| `zip_files` | `input_files` (`string[]`), `target_zip_file` | — | Compresses explicit file list into `.zip` |
| `zip_directory` | `input_directory`, `target_zip_file` | `pattern` (glob, default `"**/*"`) | Compresses matching files under `input_directory` |
| `unzip_file` | `zip_file`, `target_path` | — | Extracts `.zip` archive into `target_path` |
