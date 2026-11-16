# `paperless-mcp` Tools & Resources Reference

All 45 MCP tools and 2 resource templates exposed by `retiform-labs/paperless-mcp`.

## Documents (11 tools)

| Tool | Purpose | Key Parameters |
| :--- | :--- | :--- |
| `list_documents` | Filter/paginate documents (text excluded; returns `content_length`) | `page`, `page_size`, `title`, `correspondent`, `document_type`, `tag`, `storage_path`, created/added date bounds, `archive_serial_number`, `ordering` |
| `query_documents` | Canonical search tool (text excluded; returns `content_length`) | `query` (full-text), `search`, `more_like_id`, `custom_field_query`, `paperless_filters` (arbitrary `/api/documents/` params), pagination |
| `search_documents` | Deprecated full-text wrapper; prefer `query_documents` | Same query parameters as `query_documents` |
| `search_passages` | Full-text search returning bounded context passages anchored on hits | `query` (required), `window` (`200-4000`, default `800`), `max_passages` (default `5`, cap `20`), standard filters (`correspondent`, `tag`, `document_type`, `storage_path`, dates, `paperless_filters`) |
| `get_document` | Get document metadata + `content_length` (no inline content bloat) | `id` |
| `get_document_content` | Read paginated OCR text window (errors if `max_chars` > `PAPERLESS_MCP_MAX_INLINE_CHARS`) | `id`, `offset` (default `0`), `max_chars` (default `8000`) |
| `download_document` | Returns `paperless://` resource URI for document file | `id`, `original` (optional boolean) |
| `get_document_thumbnail` | Returns `paperless://` resource URI for WebP thumbnail preview | `id` |
| `post_document` | Upload a document (100 MB limit) | Either `file` (base64) + `filename` OR `file_path` (confined by `PAPERLESS_MCP_UPLOAD_PATHS`); optional `title`, `created`, `correspondent`, `document_type`, `storage_path`, `tags`, `archive_serial_number`, `custom_fields` |
| `update_document` | Patch document metadata (pass `null` to clear nullable IDs; `custom_fields` replaces all custom fields!) | `id`, optional `title` (max 128), `correspondent`, `document_type`, `storage_path`, `tags`, `content`, `created` (`YYYY-MM-DD`), `archive_serial_number`, `owner`, `custom_fields` |
| `bulk_edit_documents` | Bulk actions on multiple documents | `documents` (array of IDs), `method` (`set_correspondent`, `set_document_type`, `set_storage_path`, `add_tag`, `remove_tag`, `modify_tags`, `modify_custom_fields`, `delete`, `reprocess`, `set_permissions`, `merge`, `split`, `rotate`, `delete_pages`), method-specific fields, `confirm: true` required for `delete` |

### `bulk_edit_documents` Method-Specific Parameters

- `set_correspondent` / `set_document_type` / `set_storage_path` / `add_tag` / `remove_tag`: supply matching `correspondent`, `document_type`, `storage_path`, or `tag` ID.
- `modify_tags`: `add_tags` and/or `remove_tags` (non-empty ID arrays).
- `modify_custom_fields`: `add_custom_fields` (`[{field, value}]`) and/or `remove_custom_fields` (`[fieldId]`).
- `set_permissions`: `set_permissions` (`{view: {users, groups}, change: {users, groups}}`), `owner`, `merge` (default `false`; omitting `owner` clears it unless `merge: true`).
- `merge`: optional `metadata_document_id`, `delete_originals`.
- `split`: `pages` (string page ranges, e.g. `"1-2,3"`), optional `delete_originals`.
- `rotate`: `degrees` (rotation angle).
- `delete_pages`: `pages` (string page list/ranges).
- `delete`: requires `confirm: true` (permanent).

## Document Notes (3 tools)

| Tool | Purpose | Key Parameters |
| :--- | :--- | :--- |
| `list_document_notes` | List notes attached to a document | `id` |
| `create_document_note` | Add a note to a document | `id`, `note` |
| `delete_document_note` | Permanently delete a note | `document_id`, `note_id`, `confirm: true` |

## Tags (5 tools)

| Tool | Purpose | Key Parameters |
| :--- | :--- | :--- |
| `list_tags` | List all tags | Optional pagination/filters |
| `create_tag` | Create a tag | `name`, optional `color`, `is_inbox_tag`, `match`, `matching_algorithm` (`0-6`) |
| `update_tag` | Update tag properties | `id`, fields to update |
| `delete_tag` | Permanently delete tag system-wide | `id`, `confirm: true` |
| `bulk_edit_tags` | Bulk edit tags | `tags` (IDs), `operation` (`set_permissions` \| `delete`), `permissions`, `owner`, `merge`, `confirm: true` (for `delete`) |

## Correspondents (6 tools)

`list_correspondents`, `get_correspondent`, `create_correspondent`, `update_correspondent`, `delete_correspondent` (`confirm: true`), `bulk_edit_correspondents` (`operation`: `set_permissions` \| `delete`, `confirm: true` for `delete`). Support `name`, `match`, and `matching_algorithm`.

## Document Types (6 tools)

`list_document_types`, `get_document_type`, `create_document_type`, `update_document_type`, `delete_document_type` (`confirm: true`), `bulk_edit_document_types` (`operation`: `set_permissions` \| `delete`, `confirm: true` for `delete`). Support `name`, `match`, and `matching_algorithm`.

## Custom Fields (6 tools)

`list_custom_fields`, `get_custom_field`, `create_custom_field`, `update_custom_field`, `delete_custom_field` (`confirm: true`), `bulk_edit_custom_fields` (`operation: "delete"`, `confirm: true`).

Supported `data_type` values on `create_custom_field`: `"string"`, `"url"`, `"date"`, `"boolean"`, `"integer"`, `"float"`, `"monetary"`, `"documentlink"`, `"select"` (with `extra_data.select_options` when using `"select"`).

## Mail Accounts & Rules (8 tools)

Passwords and OAuth tokens are redacted from responses.

| Tool | Purpose | Key Parameters |
| :--- | :--- | :--- |
| `list_mail_accounts` | List configured IMAP accounts | Optional `page`, `page_size` |
| `get_mail_account` | Inspect a single mail account | `id` |
| `process_mail_account` | Trigger immediate fetch/processing of an account | `id` |
| `list_mail_rules` | List mail ingestion rules | Optional `page`, `page_size` |
| `get_mail_rule` | Inspect a single mail rule | `id` |
| `create_mail_rule` | Create an ingestion rule | `name`, `account`, `folder`, optional `enabled`, `filter_from`, `filter_to`, `filter_subject`, `filter_body`, `maximum_age`, `action` (`1`-`5`), `action_parameter`, `assign_title_from` (`1`-`3`), `assign_tags`, `assign_correspondent`, `assign_correspondent_from` (`1`-`4`), `assign_document_type`, `attachment_type` (`1`-`2`), `consumption_scope` (`1`-`3`), `pdf_layout` (`0`-`4`) |
| `update_mail_rule` | Patch an existing mail rule | `id`, any fields from `create_mail_rule` |
| `delete_mail_rule` | Delete a mail rule (does not delete existing documents) | `id`, `confirm: true` |

## MCP Resource Templates (2 templates)

Read these via `resources/read` using URIs returned by `download_document` or `get_document_thumbnail`:

- `paperless://documents/{id}/download{?original}` — Downloads the archived PDF (`original=false`) or original uploaded file (`original=true`).
- `paperless://documents/{id}/thumbnail` — Fetches the base64 WebP preview image.
