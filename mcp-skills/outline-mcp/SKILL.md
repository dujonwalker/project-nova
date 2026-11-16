---
name: outline-mcp
description: >-
  Use this skill whenever interacting with an Outline Wiki knowledge base via
  the Vortiago/mcp-outline server — browsing collections and trees, searching
  documents (including drafts/archived via status_filter), reading TOC/sections
  or line ranges, performing targeted or staged edits, batching document
  operations, managing comments/attachments/AI Q&A, or checking backlinks. Also
  use when configuring mcp-outline transports (stdio, sse, streamable-http),
  x-outline-api-key headers, or read-only/delete/dynamic tool filters.
license: MIT
metadata:
  author: Project NOVA maintainers
  version: "1.0"
  upstream: "https://github.com/Vortiago/mcp-outline"
---

# Outline MCP (`outline-mcp`)

Use the `outline-mcp` (`Vortiago/mcp-outline`) tools and `outline://` resources as the primary interface for searching, reading, creating, editing, and organizing documents and collections in Outline.

## Core Workflows

- **Browse & resolve IDs first**: Document titles are not unique. Start with `list_collections`, `get_collection_structure`, `get_document_id_from_title`, or `search_documents`. Check `get_document_backlinks` before moving or deleting docs.
- **Read large documents incrementally**:
  1. Call `get_document_toc` (returns headings with 0-based line numbers).
  2. Call `read_document_section(heading=...)` or `search_document_content(query=...)` to jump straight to relevant sections or matching lines.
  3. Page raw content with `read_document(offset, limit)` using those line numbers. Reserve full unpaged `read_document` calls for small documents.
- **Edit with `edit_document` by default**: Supply sequential `edits` (`{old_string, new_string}`) where each `old_string` matches uniquely (applied all-or-nothing). Reserve `update_document` for full replacements, title/icon/template updates, or `append=True`.
- **Stage multi-pass rewrites**: Accumulate edits in server memory with `edit_document(document_id, edits=[...], save=False)`, then flush in one Outline write using `save=True` (or `edits=[], save=True`).
- **Batch multi-document changes**: Use `batch_create_documents`, `batch_update_documents`, `batch_move_documents`, `batch_archive_documents`, and `batch_delete_documents` instead of single-doc loops.

Read [references/tools-reference.md](references/tools-reference.md) for all 38 tools and 5 `outline://` resource templates.

## Gotchas

- **Mermaid diagrams use `mermaidjs`, not `mermaid`**: Code blocks in Outline Markdown must use ` ```mermaidjs ` fences—plain ` ```mermaid ` renders as raw source code.
- **Search excludes drafts & archived docs by default**: `search_documents` and `list_recently_updated_documents` only return `"published"` docs unless you pass `status_filter=["draft", "published", "archived"]`.
- **Staged edits are in-memory only**: Unflushed `edit_document(..., save=False)` changes vanish on server restart. Note that read tools show staged content (with an unsaved-changes notice), while `export_document` returns only the last persisted version.
- **Deletions vs Trash**: `delete_document()` moves a doc to Trash (recoverable via `restore_document` / `list_trash`); `permanent=True` is irreversible.
- **Role/flag-filtered tool lists**: `OUTLINE_READ_ONLY`, `OUTLINE_DISABLE_DELETE`, `OUTLINE_DISABLE_AI_TOOLS`, `OUTLINE_DISABLE_RECENT_DOCUMENTS`, and `OUTLINE_DYNAMIC_TOOL_LIST` can hide subsets of tools—work with the active tool list cleanly.

## Connection Setup

Read [references/setup-and-config.md](references/setup-and-config.md) when deploying `mcp-outline` (`stdio`, `sse`, or `streamable-http`), configuring `x-outline-api-key` headers, or setting self-hosted TLS and permission flags.
