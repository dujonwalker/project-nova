---
name: bookstack-mcp
description: >-
  Use this skill whenever interacting with a BookStack wiki via the
  bookstack-mcp MCP server — searching or reading books, chapters, pages,
  shelves, attachments, comments, and images; exporting content; creating or
  updating pages, tags, and gallery images; or restoring from the recycle bin.
  Also use when configuring bookstack-mcp (read-only vs write mode, API tokens,
  image host allowlists, or client setup).
license: MIT
metadata:
  author: Project NOVA maintainers
  version: "1.0"
  upstream: "https://github.com/ttpears/bookstack-mcp"
---

# BookStack MCP (`bookstack-mcp`)

Use the `bookstack-mcp` MCP tools as the primary interface for reading, searching, exporting, and maintaining a BookStack wiki.

## Core Workflows

- **Search & discover**: Start with `search_content` (supports BookStack qualifiers like `{type:page}`, `{created_by:jane-doe}`, `{updated_by:me}`) or `search_pages` (scoped by `book_id`), plus `get_recent_changes`, `get_books`, `get_chapters`, `get_shelves`, and `get_pages`. Search results are previews—always fetch full content with `get_page`.
- **Read large pages**: Call `get_page` (`limit` defaults to `50000`, max `200000` chars). If `content_next_offset` is non-null, call `get_page` again with `offset: content_next_offset` and the same `format` until `null`. Always read all chunks before editing a large page.
- **Edit pages safely**:
  - **Markdown pages**: Read with `format: "markdown"`, update with `markdown`.
  - **HTML/WYSIWYG pages**: Read with `format: "raw"`, update with `html`.
  - **Tags**: `tags` replaces the entire tag list. Omit `tags` to preserve existing tags, send `tags: []` to clear all, or read current tags first and send the full desired list.
  - **Move/reorder**: On `create_page`, omit `chapter_id` for a top-level book page (`chapter_id: 0` can 404). On `update_page`, pass `chapter_id: 0` with `book_id` to move an existing page to a book's top level; moving into a chapter requires both `chapter_id` and `book_id`. Lower `priority` sorts first.
- **Images, attachments & exports**:
  - `create_image` uploads gallery images (PNG/JPEG/GIF/WebP/SVG, up to 50 MiB) via `url` or `file_path` (local `stdio` only) and returns `content.html` / `content.markdown` snippets. It does **not** insert the image into the page—follow up with `update_page`.
  - `create_attachment` creates **link** attachments (`name`, `uploaded_to`, `link`), not binary file uploads.
  - `export_page` / `export_book` / `export_chapter`: `html`, `markdown`, and `plaintext` return content directly; `pdf` and `zip` return BookStack web download URLs.
- **Comments & recovery**: `get_comments` / `create_comment` / `update_comment` / `delete_comment` require BookStack v25.11+. For deletions, get `deletion_id` from `get_recycle_bin`, then call `restore_deleted` or `permanently_delete` (irreversible).

Read [references/tools-reference.md](references/tools-reference.md) for all 43 tools (21 read + 22 write), MCP resource templates, and prompts.

## Gotchas

- **Read-only by default**: Only 21 read tools are registered unless `BOOKSTACK_ENABLE_WRITE=true` (or OAuth write-role + write-token pair) is configured. Tool visibility does not override BookStack role permissions.
- **Never save rendered `html` back to a page**: `get_page` with `format: "html"` returns the rendered reader view (stripping editor attributes and expanding includes), and saving `html` on a Markdown page clears its stored Markdown source.
- **Author search requires slugs, not IDs**: `{created_by:...}`, `{updated_by:...}`, and `{owned_by:...}` reject numeric user IDs; use `me` or a user slug (resolve via `find_users` if you have admin access).
- **`Export Content` permission for Markdown**: BookStack stores no Markdown source for WYSIWYG pages, so `bookstack-mcp` falls back to BookStack's export endpoint, which requires the **Export Content** role permission.
- **`deletion_id` != entity ID**: `restore_deleted` and `permanently_delete` take the `deletion_id` from `get_recycle_bin`, not the original page/book/chapter ID.
- **`changelog` version behavior**: `changelog` (1–180 chars) on `create_page`/`update_page` is recorded on BookStack v26.09+ and silently ignored on older versions.

## Setup & Configuration

If `bookstack-mcp` is not yet connected or needs write mode, image allowlists (`BOOKSTACK_IMAGE_ALLOWED_HOSTS`), or client config, read [references/setup-and-config.md](references/setup-and-config.md).
