---
name: nextcloud-mcp
description: Interact with a Nextcloud instance over MCP via `nextcloud-mcp` (`cbcoutinho/nextcloud-mcp-server`) — manage Notes, Calendar events and todos, Contacts, Files/WebDAV (including PDF parsing, OCR, versions, trash, tags, comments, and sharing), Deck boards/cards, Cookbook recipes, Tables, Collectives wiki pages, News feeds, Mail, Talk conversations, Shopping Lists, and optional semantic search. Use whenever reading, creating, searching, or organizing Nextcloud data via MCP. Do not use for standalone Git hosting, Paperless-NGX, BookStack/Outline/Trilium/Memos/Blinko, or local workspace files.
---

# Nextcloud MCP (`nextcloud-mcp`)

Control Nextcloud apps through [`cbcoutinho/nextcloud-mcp-server`](https://github.com/cbcoutinho/nextcloud-mcp-server) (`v0.212.0`) over MCP. Exposed tools depend on which Nextcloud apps are installed (capability-gated via `/ocs/v2.php/cloud/capabilities`), whether `--enable-app` restricts active modules, and whether optional semantic search (`ENABLE_SEMANTIC_SEARCH=true`) is enabled.

## Core Workflows

1. **Discover containers before creating or modifying items:**
   - **Calendar:** Call `nc_calendar_list_calendars` to pick the target calendar before `nc_calendar_create_event` / `nc_calendar_create_todo`.
   - **Contacts / Tables / Deck / Collectives / Mail / Talk:** List address books (`nc_contacts_list_addressbooks`), tables (`nc_tables_list_tables`), boards/stacks (`deck_get_boards`, `deck_get_stacks`), collectives (`collectives_get_collectives`), mailboxes (`nc_mail_list_accounts`, `nc_mail_list_mailboxes`), or rooms (`talk_list_conversations`) first.
2. **Read & edit Nextcloud files safely:**
   - Browse with `nc_webdav_list_directory` or `nc_webdav_search_files`.
   - Use `nc_webdav_read_file` (with document parsing for PDFs/documents when needed) and `nc_webdav_edit_file` for targeted text replacements instead of blindly overwriting with `nc_webdav_write_file`.
   - Respect `EXCLUDED_TAGS` exclusions and use `nc_share_*` tools for internal or public link shares.
3. **Destructive & outbound actions:**
   - Confirm before deleting notes/events/files/collectives/cards/mails, purging trash, sending outbound emails (`nc_mail_send_message` vs safe `nc_mail_save_draft`), posting to Talk rooms (`talk_send_message`), or creating public share links (`nc_share_create_public_link`) unless explicitly instructed.

## References

- Complete app & tool catalog across all 13 Nextcloud apps + optional modules: [references/tools-reference.md](references/tools-reference.md)
- Transport, auth modes (`single_user_basic`, `multi_user_basic`, `login_flow`), capability gating & semantic search: [references/setup-and-config.md](references/setup-and-config.md)
