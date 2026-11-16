---
name: karakeep-mcp
description: >-
  Use this skill whenever interacting with Karakeep via the karakeep-mcp MCP
  server — searching or reading bookmarks and Markdown content, saving links or
  text notes, organizing lists (manual and smart), managing tags, creating or
  editing highlights, or fetching temporary signed asset URLs. Also use when
  configuring karakeep-mcp (KARAKEEP_API_ADDR, KARAKEEP_API_KEY,
  KARAKEEP_CUSTOM_HEADERS).
license: MIT
metadata:
  author: Project NOVA maintainers
  version: "1.0"
  upstream: "https://github.com/karakeep-app/karakeep/tree/main/apps/mcp"
---

# Karakeep MCP (`karakeep-mcp`)

Use the `karakeep-mcp` MCP tools as the primary interface for searching, reading, organizing, and annotating bookmarks in Karakeep.

## Core Workflows

- **Search & read content (two-step)**: `search-bookmarks` and `get-bookmark` return compact metadata only (`includeContent: false`). Always call `get-bookmark-content` to read the full bookmark body (link HTML is returned as Markdown).
- **Search syntax & modes**: `search-bookmarks` supports `is:fav`, `is:archived`, `is:tagged`, `is:inlist`, `is:link`, `is:text`, `is:media`, `url:<substr>`, `#<tag>`, `list:<name>` (without emoji icon; quote names with spaces), `after:YYYY-MM-DD`, `before:YYYY-MM-DD`, `-<qualifier>` negation, and `and`/`or`. Choose `searchMode`: `fts` (default), `semantic`, or `hybrid`.
- **Save & update bookmarks**: Use `create-bookmark` (`type: "link"` with URL in `content`, or `type: "text"` with note text in `content`). Use `update-bookmark` for partial updates (`title`, `note`, `summary`, `archived`, `favourited`, `url`, `description`, `author`, `publisher`, `createdAt`); pass `null` to clear nullable fields (`title`, `summary`, `description`, `author`, `publisher`).
- **Lists & tags**:
  - Use `get-lists` / `get-list-bookmarks` (evaluates both manual and smart lists), `create-list`, `update-list`, `add-bookmark-to-list`, and `remove-bookmark-from-list`.
  - Use `attach-tag-to-bookmark` / `detach-tag-from-bookmark` with **tag names** (`tagsToAttach` / `tagsToDetach`), whereas `get-tag`, `update-tag`, `delete-tag`, and `get-tag-bookmarks` take a **`tagId`**.
- **Highlights & assets**: Use `create-highlight` with character offsets (`startOffset`, `endOffset`) from the bookmark's readable content and color (`yellow`, `red`, `green`, `blue`). Use `get-asset` to obtain a temporary signed download URL.

Read [references/tools-reference.md](references/tools-reference.md) for all 29 tools and their parameters.

## Gotchas

- **Bound `get-tags` calls**: `get-tags` has no default `limit` and can return massive responses on large libraries. Always pass `limit` (and `nameContains` / `attachedBy` / `sort` when filtering), and paginate with `cursor` (note: `get-tags` uses `cursor`, whereas `search-bookmarks` uses `nextCursor`).
- **Cursor pagination & search modes**: Paginated tools use cursor-based pagination, not offsets. `semantic` and `hybrid` search modes only support `sortOrder: "relevance"`.
- **No `list-bookmarks` tool or MCP resources**: `karakeep-mcp` exposes tools only (no MCP resources) and lists bookmarks via `search-bookmarks`, `get-list-bookmarks`, or `get-tag-bookmarks`.
- **Archived-search pagination quirk**: Karakeep's `is:archived` search can return `nextCursor: null` while returning a subset of archived items; when bulk-processing archived items, re-run `search-bookmarks` (`is:archived`) until empty.
- **`delete-list` orphans child lists**: Deleting a list does not delete its bookmarks or child lists—child lists become root-level (`parentId: null`). Re-parent child lists before deleting if needed.
- **`delete-bookmark` is permanent**: Permanently removes the bookmark, its highlights, and its assets. (`delete-tag` only detaches the tag and keeps bookmarks.)

## Setup & Configuration

Read [references/setup-and-config.md](references/setup-and-config.md) when configuring `@karakeep/mcp` (`npx` or Docker), `KARAKEEP_API_ADDR`, `KARAKEEP_API_KEY`, or `KARAKEEP_CUSTOM_HEADERS`.
