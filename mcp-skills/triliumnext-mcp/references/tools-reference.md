# `triliumnext-mcp` Tools Reference

All 20 MCP tools registered by `perfectra1n/triliumnext-mcp`, grouped across 8 categories.

## Search (2 tools)

| Tool | Purpose | Key Parameters |
| :--- | :--- | :--- |
| `search_notes` | Search notes with Trilium syntax (`#label`, `~relation`, `"exact"`, `ancestor:`) and optional previews/fuzzy OR fallback | `query` (required), `strategy` (`"auto"` \| `"fast"` \| `"full"`), `fastSearch` (overrides `strategy`), `includeArchivedNotes`, `ancestorNoteId`, `ancestorDepth` (`eqN`/`ltN`/`gtN`), `orderBy`, `orderDirection`, `limit`, `content_preview_chars` (`0-2000`, top 20 results), `fuzzy` (`"auto"` \| `"off"` \| `"force"`), `debug` |
| `get_note_tree` | Browse hierarchy subtree (nodes include `childBranchIds`) | `noteId` (`"root"` etc.), `depth` |

## Notes (5 tools)

| Tool | Purpose | Key Parameters |
| :--- | :--- | :--- |
| `get_note` | Read note metadata, path, backlinks, and optionally paginated content | `noteId`, `include_content`, `format` (`"html"` \| `"markdown"`), `includeImages`, `content_start`, `content_max_chars`, `include_path`, `include_backlinks` |
| `get_note_history` | Recent note changes across tree (including deleted notes) | `ancestorNoteId` (optional), `limit` (`1-1000`, default `100`) |
| `create_note` | Create note with optional embedded images/files | `parentNoteId`, `title`, `type` (`text`, `code`, `render`, `mermaid`, `book`, `canvas`, `mindMap`, `geoMap`, `relationMap`, `noteMap`, `webView`, etc.), `content`, `format` (`"html"` \| `"markdown"`), `mime`, `notePosition`, `prefix`, `isExpanded`, `noteId`, `branchId`, dates, `images`, `files` |
| `write_note` | Update metadata or edit content | `noteId`, `mode` (`"metadata"` \| `"replace"` \| `"append"` \| `"edit"`), metadata fields (`title`, `type`, `mime`, `dateCreated`, `utcDateCreated`, `utcDateModified`), `content`+`format` (`replace`/`append`), `changes` (`[{old_string, new_string}]`) or `patch` (unified diff for `edit`), `images`, `files` |
| `delete_note` | Delete or restore a deleted note | `noteId`, `action` (`"delete"` \| `"undelete"`) |

## Revisions (2 tools)

| Tool | Purpose | Key Parameters |
| :--- | :--- | :--- |
| `get_revisions` | List revisions for a note, or fetch one revision's snapshot | Pass **exactly one** of `noteId` (list metadata) or `revisionId` (single revision; `include_content` defaults to `true`) |
| `restore_revision` | Restore note content (and title by default) from a revision | `revisionId`, `snapshot_current` (default `true` — calls `create_revision` first), `restore_title` (default `true`) |

## Attributes (3 tools)

Pass attribute `name` **without** leading `#` (labels) or `~` (relations).

| Tool | Purpose | Key Parameters |
| :--- | :--- | :--- |
| `get_attributes` | Inspect attributes on a note or a single attribute | Pass **exactly one** of `noteId` (grouped labels/relations) or `attributeId` |
| `set_attribute` | Upsert or add a label or relation | `noteId`, `type` (`"label"` \| `"relation"`), `name`, `value` (or target `noteId`), `mode` (`"upsert"` default \| `"add"` for multi-value same-name labels), `isInheritable`, `position`, `attributeId` |
| `delete_attribute` | Remove an attribute by ID | `attributeId` |

## Attachments (4 tools)

| Tool | Purpose | Key Parameters |
| :--- | :--- | :--- |
| `get_attachment` | List note attachments (metadata-only) or fetch one attachment body | Pass **exactly one** of `noteId` (list) or `attachmentId` (`include_content` defaults to `true`: returns image block, raw text, or base64) |
| `create_attachment` | Attach file/image/text to a note | `ownerId`, `role`, `mime`, `title`, `content` (file path if allowed, URL, data URL, base64, or raw text), `position` |
| `write_attachment` | Edit attachment metadata or content | `attachmentId`, `mode` (`"metadata"` \| `"replace"` \| `"edit"`), metadata fields (`role`, `mime`, `title`, `position`), `content` (`replace`), `changes` or `patch` (`edit`) |
| `delete_attachment` | Delete an attachment | `attachmentId` |

## Calendar & Special Notes (1 tool)

| Tool | Purpose | Key Parameters |
| :--- | :--- | :--- |
| `get_special_note` | Fetch/auto-create periodic or inbox notes | `kind`: `"day"` (`YYYY-MM-DD`), `"inbox"` (`YYYY-MM-DD`), `"week_first_day"` (`YYYY-MM-DD`), `"week"` (`YYYY-Www`), `"month"` (`YYYY-MM`), `"year"` (`YYYY`); `date` (defaults to current period) |

## Organization (1 tool)

| Tool | Purpose | Key Parameters |
| :--- | :--- | :--- |
| `organize_note` | Move, clone, reorder, or unlink branches | `action` (`"move"` \| `"clone"` \| `"reorder"` \| `"unlink"`), `noteId`, `newParentNoteId`, `fromParentNoteId` (required when moving cloned note), `parentNoteId`, `prefix`, `notePositions` (`[{branchId, notePosition}]`), `branchId` |

## System & Snapshots (2 tools)

| Tool | Purpose | Key Parameters |
| :--- | :--- | :--- |
| `create_revision` | Snapshot a note's current state before editing | `noteId`, `format` (default `"html"`) |
| `manage_system` | Database backup, subtree ZIP export/import, version info, stats | `action` (`"backup"` \| `"export"` \| `"import"` \| `"app_info"` \| `"metrics"`), `backupName` (`backup`), `noteId` (`"root"` or subtree for `export`; parent for `import`), `format` (`"markdown"` recommended for LLMs on `export`), `data` (base64 ZIP for `import`) |

## Functional Note Recipes (`create_note` -> `set_attribute`)

1. **Frontend / Backend Runnable Script**: `create_note` with `type: "code"`, `mime: "application/javascript;env=frontend"` or `"application/javascript;env=backend"`. Auto-run via `set_attribute` (`type: "label"`, `name: "run"`, `value: "frontendStartup"` / `"backendStartup"` / `"hourly"` / `"daily"`), or expose backend HTTP handler via `name: "customRequestHandler"`.
2. **Render Dashboard**: `create_note` with `type: "render"` (empty `mime`), then `set_attribute` on the render note: `type: "relation"`, `name: "renderNote"`, `value: "<frontendCodeNoteId>"`.
3. **Custom Widget**: `create_note` with `type: "code"`, `mime: "application/javascript;env=frontend"`, then `set_attribute` (`type: "label"`, `name: "widget"`, `value: ""`).
