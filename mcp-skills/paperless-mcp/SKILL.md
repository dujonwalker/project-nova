---
name: paperless-mcp
description: >-
  Use this skill whenever interacting with a Paperless-ngx document archive
  via the retiform-labs/paperless-mcp server — searching documents and bounded
  passages, reading paginated OCR text, downloading originals or thumbnails,
  uploading files, updating metadata/tags/correspondents/types/custom fields,
  running bulk document edits, managing notes, or configuring mail accounts and
  rules. Also use when setting up or troubleshooting @retiform/paperless-mcp
  (stdio or HTTP transport, PAPERLESS_API_VERSION, or upload path guards).
license: MIT
metadata:
  author: Project NOVA maintainers
  version: "1.0"
  upstream: "https://github.com/retiform-labs/paperless-mcp"
---

# Paperless-ngx MCP (`paperless-mcp`)

Use the `paperless-mcp` MCP tools and `paperless://` resources as the primary interface for searching, reading, uploading, organizing, and automating a Paperless-ngx instance.

## Core Workflows

- **Lookup taxonomy IDs first**: Filtering tools expect numeric IDs, not names. Call `list_tags`, `list_correspondents`, `list_document_types`, or `list_custom_fields` before filtering `list_documents` / `query_documents` or creating/updating documents.
- **Search without flooding context**:
  1. `list_documents` / `query_documents` exclude document text by default and report `content_length` so you can gauge size before reading. Prefer `query_documents` over deprecated `search_documents`.
  2. Use `search_passages` to locate verbatim or stemmed full-text hits as bounded snippets (`window` default `800`, `max_passages` default `5`), with `offset` and `content_length` for follow-up reads.
  3. Use `get_document_content` to page through OCR text (`offset` default `0`, `max_chars` default `8000`).
- **Download files & previews**: `download_document` and `get_document_thumbnail` return `paperless://` resource URIs (`paperless://documents/{id}/download` and `paperless://documents/{id}/thumbnail`). Read the returned MCP resource URI to fetch the file or WebP thumbnail.
- **Upload documents**: Call `post_document` with either base64 `file` + `filename` or a server-local `file_path` (100 MB limit; `file_path` is restricted by `PAPERLESS_MCP_UPLOAD_PATHS`).
- **Update & bulk-edit metadata**: Use `update_document` for single-document changes (pass `null` to clear `correspondent`, `document_type`, `storage_path`, or `owner`), or `bulk_edit_documents` for multi-document operations (`set_correspondent`, `set_document_type`, `set_storage_path`, `add_tag`, `remove_tag`, `modify_tags`, `modify_custom_fields`, `reprocess`, `set_permissions`, `merge`, `split`, `rotate`, `delete_pages`, `delete`).

Read [references/tools-reference.md](references/tools-reference.md) for all 45 tools, `paperless://` resource templates, and parameter details.

## Gotchas

- **`update_document` `custom_fields` replaces the whole set**: Unlike other omitted top-level fields, passing `custom_fields` replaces every custom field value on the document. Use `bulk_edit_documents` with `method: "modify_custom_fields"` (`add_custom_fields` / `remove_custom_fields`) for incremental updates.
- **Destructive deletes require `confirm: true`**: `bulk_edit_documents` (`method: "delete"`), `delete_document_note`, `delete_mail_rule`, `delete_tag`, `delete_correspondent`, `delete_document_type`, `delete_custom_field`, and `delete` operations on `bulk_edit_*` fail unless `confirm: true` is passed. Note `remove_tag` removes a tag from documents, whereas `delete_tag` deletes it system-wide.
- **`set_permissions` clears `owner` unless `merge: true`**: In `bulk_edit_*`, omitting `owner` clears existing ownership and passing `[]` clears users/groups unless `merge: true` is set.
- **Inline character cap**: `get_document_content` rejects `max_chars` requests above `PAPERLESS_MCP_MAX_INLINE_CHARS` (default `50000`) with an error showing the document length—page with `offset` or read the `download_document` resource instead.
- **Sanitized full-text retries**: `search_passages` retries Paperless HTTP 400 query syntax errors (such as stray quotes/apostrophes) with a sanitized query and sets `query_sanitized: true`.

## Connection Setup

Read [references/setup-and-config.md](references/setup-and-config.md) when deploying `@retiform/paperless-mcp` (stdio or `--http`), configuring `--no-auth`, or setting `PAPERLESS_API_VERSION` and `PAPERLESS_MCP_UPLOAD_PATHS`.
