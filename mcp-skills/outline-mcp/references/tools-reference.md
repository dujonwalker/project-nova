# `outline-mcp` Tools & Resources Reference

All 38 MCP tools and 5 resource templates exposed by `Vortiago/mcp-outline`. Deployments may hide write, delete, AI, or recent-document tools depending on server flags (`OUTLINE_READ_ONLY`, `OUTLINE_DISABLE_DELETE`, `OUTLINE_DISABLE_AI_TOOLS`, `OUTLINE_DISABLE_RECENT_DOCUMENTS`, `OUTLINE_DYNAMIC_TOOL_LIST`).

## Search & Discovery (5 tools)

| Tool | Parameters | Notes |
| :--- | :--- | :--- |
| `search_documents` | `query`, `collection_id?`, `limit=25`, `offset=0`, `status_filter?` (`["draft", "archived", "published"]`) | Published-only unless `status_filter` is passed |
| `list_collections` | `limit=100`, `offset=0` | Lists collections and IDs |
| `get_collection_structure` | `collection_id` | Returns document hierarchy tree for a collection |
| `get_document_id_from_title` | `query`, `collection_id?` | Resolves title matches to document IDs |
| `list_recently_updated_documents` | `date_filter="week"` (`day`/`week`/`month`/`year`), `collection_id?`, `status_filter?`, `limit=25`, `offset=0` | Disabled if `OUTLINE_DISABLE_RECENT_DOCUMENTS=true` |

## Reading & Navigation (5 tools)

| Tool | Parameters | Notes |
| :--- | :--- | :--- |
| `read_document` | `document_id`, `offset=0`, `limit=0` | Reads full or line-sliced document Markdown |
| `export_document` | `document_id` | Exports persisted Outline Markdown (bypasses unstaged edits) |
| `get_document_toc` | `document_id` | Returns ATX headings with 0-based line numbers |
| `read_document_section` | `document_id`, `heading` | Case-insensitive heading substring match |
| `search_document_content` | `document_id`, `query`, `context_lines=2` | Line-level grep inside one document |

## Creating, Editing & Collaboration (7 tools)

| Tool | Parameters | Notes |
| :--- | :--- | :--- |
| `create_document` | `title`, `collection_id`, `text=""`, `parent_document_id?`, `publish=True`, `template?`, `icon?` | Publishes immediately unless `publish=False` |
| `update_document` | `document_id`, `title?`, `text?`, `append=False`, `template?`, `icon?` | Full replacement, metadata change, or `append=True` |
| `edit_document` | `document_id`, `edits` (`[{old_string, new_string}]`), `save=True` | Atomic sequential exact-match edits; supports in-memory staging (`save=False`) |
| `add_comment` | `document_id`, `text`, `parent_comment_id?` | Creates top-level comment or threaded reply |
| `list_document_comments` | `document_id`, `include_anchor_text=False`, `limit=25`, `offset=0` | Lists document comments |
| `get_comment` | `comment_id`, `include_anchor_text=False` | Reads a single comment |
| `get_document_backlinks` | `document_id` | Finds documents linking to this document |

## Lifecycle & Organization (7 tools)

| Tool | Parameters | Notes |
| :--- | :--- | :--- |
| `move_document` | `document_id`, `collection_id?`, `parent_document_id?` | Moves to another collection and/or parent |
| `archive_document` | `document_id` | Moves document to Archive |
| `unarchive_document` | `document_id` | Restores archived document |
| `delete_document` | `document_id`, `permanent=False` | Trash (30-day recovery) or permanent delete |
| `restore_document` | `document_id` | Restores document from Trash |
| `list_archived_documents` | *(none)* | Lists archived documents |
| `list_trash` | *(none)* | Lists trashed documents |

## Attachments (3 tools)

- `list_document_attachments(document_id)` — Lists attachments referenced by a document.
- `get_attachment_url(attachment_id)` — Resolves attachment redirect URL.
- `fetch_attachment(attachment_id)` — Fetches attachment content.

## Collections (5 tools)

- `create_collection(name, description="", color?)`
- `update_collection(collection_id, name?, description?, color?)`
- `delete_collection(collection_id)` *(disabled if `OUTLINE_DISABLE_DELETE=true`)*
- `export_collection(collection_id, format="outline-markdown")`
- `export_all_collections(format="outline-markdown")` *(admin role required)*

## Batch Operations & AI (6 tools)

- `batch_create_documents(documents)` — Bulk create (`BatchCreateItem[]`).
- `batch_update_documents(updates)` — Bulk update (`BatchUpdateItem[]`).
- `batch_move_documents(document_ids, collection_id?, parent_document_id?)` — Bulk move.
- `batch_archive_documents(document_ids)` — Bulk archive.
- `batch_delete_documents(document_ids, permanent=False)` *(disabled if `OUTLINE_DISABLE_DELETE=true`)*.
- `ask_ai_about_documents(question, collection_id?, document_id?)` — Outline natural-language Q&A (disabled if `OUTLINE_DISABLE_AI_TOOLS=true`).

## MCP Resource Templates (5 templates)

- `outline://collection/{collection_id}` — Collection metadata
- `outline://collection/{collection_id}/tree` — Collection document hierarchy
- `outline://collection/{collection_id}/documents` — Document list in collection
- `outline://document/{document_id}` — Document Markdown content
- `outline://document/{document_id}/backlinks` — Linking documents
