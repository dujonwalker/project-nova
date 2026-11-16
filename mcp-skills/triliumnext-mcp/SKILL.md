---
name: triliumnext-mcp
description: >-
  Use this skill whenever managing Trilium or TriliumNext notes via the
  perfectra1n/triliumnext-mcp MCP server — searching notes and subtrees, reading
  or editing note content (HTML, Markdown, search/replace diffs), wiring labels
  and relations, managing attachments and revisions, fetching daily/weekly/inbox
  notes, reorganizing/cloning branches, or running backups/exports. Also use
  when configuring triliumnext-mcp transports (/mcp, /sse, stdio), multi-tenant
  headers, gateway auth, or SSRF/file-read guards.
license: MIT
metadata:
  author: Project NOVA maintainers
  version: "1.0"
  upstream: "https://github.com/perfectra1n/triliumnext-mcp"
---

# TriliumNext MCP (`triliumnext-mcp`)

Use the `triliumnext-mcp` MCP tools as the primary interface for exploring, reading, creating, editing, linking, and organizing notes in TriliumNext.

## Core Workflows

- **Explore before writing**: Call `search_notes` (pass `content_preview_chars: 250` to inspect candidates without N+1 `get_note` calls) and `get_note_tree` to resolve parent note IDs before creating or moving notes.
- **Read & page large notes**: Call `get_note` with `content_start` / `content_max_chars` for paginated reads, `include_path: true` for breadcrumb locations, and `include_backlinks: true` for inbound references.
- **Edit notes cleanly**: Use `write_note` with `mode`: `"metadata"`, `"replace"`, `"append"`, or `"edit"` (`changes` search/replace blocks or unified `patch`). Set `format: "markdown"` when writing Markdown to `text` notes. Run `create_revision` before risky rewrites.
- **Internal links**: Write `<a href="note:TARGET_ID">text</a>` or Markdown `[text](note:TARGET_ID)` in `create_note` / `write_note` — the server resolves real Trilium reference links and rejects unknown IDs. Share the returned `url` when done.
- **Functional notes take two steps**: Creating `code`, `render`, or widget notes leaves them inert until attributes are attached with `set_attribute` (pass names **without** leading `#` or `~`).

Read [references/tools-reference.md](references/tools-reference.md) for all 20 tools, parameter modes, and functional recipes (`code`, `render`, widgets).

## Gotchas

- **`search_notes` strategy & `TRILIUM_BUSY`**: Defaults to `strategy: "auto"` (titles/labels first, falling back to body search only when fewer than 5 results match). Use `"full"` only when terms appear solely in bodies. On `TRILIUM_BUSY`, wait the suggested cooldown (`--busy-cooldown`, default `30s`) instead of retrying immediately.
- **Timestamps only in `mode: "metadata"`**: `write_note` rejects `dateCreated`/`utcDateCreated`/`utcDateModified` on content writes. Update dates in a separate `mode: "metadata"` call *after* content edits (`utcDateModified` requires Trilium > 0.105).
- **Multi-parent `organize_note` `"move"`**: Cloned notes with multiple parents require `fromParentNoteId`; the tool fails rather than guessing which placement to remove. Calling `"unlink"` on a note's **last** branch deletes the note itself.
- **`delete_note` is reversible**: Use `action: "delete"` to delete and `action: "undelete"` (requires at least one undeleted parent) to restore; discover deleted IDs via `get_note_history`.
- **Protected notes**: `restore_revision` cannot restore protected notes via ETAPI, and `content_preview_chars` skips binary and protected notes.

## Connection Setup

Read [references/setup-and-config.md](references/setup-and-config.md) when deploying `triliumnext-mcp` (`stdio` vs `--transport http`), enabling `--multi-tenant`, setting `--public-url`, or configuring gateway auth, allowlists, and `--allow-local-file-read`.
