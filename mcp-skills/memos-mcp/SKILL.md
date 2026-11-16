---
name: memos-mcp
description: >-
  Use this skill whenever interacting with a Memos instance via its native
  built-in Streamable HTTP MCP server (/mcp) — listing, searching (CEL
  filters), creating, updating, pinning, or deleting memos; managing memo
  comments, reactions, attachments, and relations; discovering user views; or
  managing spaces, members, and invitations. Also use when configuring Memos
  MCP client connections (/mcp endpoint, Bearer token, Origin safety).
license: MIT
metadata:
  author: Project NOVA maintainers
  version: "1.0"
  upstream: "https://github.com/usememos/memos/tree/main/server/mcp"
---

# Memos MCP (`memos-mcp`)

Use the native Memos MCP tools (served at `/mcp`) as the primary interface for reading, creating, organizing, and managing memos, attachments, and spaces.

## Core Workflows & Schema Shape

- **Arguments wrap payloads in `body`**: Path and query parameters sit at the top level, while request payloads sit inside a `body` object (`additionalProperties: false` is strictly validated):
  - Create memo: `memo_create_memo` with `{"body": {"content": "Note text #tag", "visibility": "PRIVATE"}}` (`content` is required; `#hashtags` in Markdown are auto-extracted as tags; visibility is `PRIVATE`, `PROTECTED`, or `PUBLIC`).
  - Update memo: `memo_update_memo` with `{"name": "memos/{id}", "body": {...}}` (`body` requires at least 1 property; `name` is supplied at the top level, not inside `body`).
- **Orientation & discovery**: Call `auth_get_current_user` to resolve the authenticated user, then `user_list_memo_views` to fetch saved CEL filter expressions you can pass to `memo_list_memos`.
- **Comments, reactions, attachments & relations**:
  - `memo_list_memo_comments` / `memo_create_memo_comment` (payload in `body.content`)
  - `memo_list_memo_reactions` / `memo_upsert_memo_reaction` (`body.reaction`) / `memo_delete_memo_reaction`
  - `attachment_list_attachments` / `attachment_create_attachment` / `attachment_get_attachment` / `attachment_delete_attachment`
  - `memo_list_memo_attachments` / `memo_set_memo_attachments` (`body.attachments`) and `memo_list_memo_relations` / `memo_set_memo_relations` (`body.relations`)
- **Spaces & invitations**: Memos can be placed in a space (`Memo.space`) with `SPACE` visibility. Use `space_list_spaces`, `space_get_space`, `space_list_space_members`, and `space_list_user_space_invitations` / `space_accept_space_invitation` / `space_decline_space_invitation`.

Read [references/tools-reference.md](references/tools-reference.md) for all 36 curated tools, parameter overrides, and annotation hints.

## Gotchas

- **Tools only (no resources or prompts)**: Memos `/mcp` exposes a fixed 36-tool catalog (24h TTL, no `listChanged` notifications) over stateless Streamable HTTP (JSON responses, no SSE, no session IDs).
- **`memo_set_memo_attachments` & `memo_set_memo_relations` replace the whole set**: Both are full-set replacements (`PATCH`), not appends. Always list existing attachments/relations first and include any items you want to keep.
- **`memo_update_memo` & `space_update_space` overwrite passed fields**: Partial updates require at least one field inside `body`; `space_update_space_member` overwrites the member's `role`.
- **`space_delete_space` deletes memos inside the space**: Deleting a space also deletes every memo placed in it.
- **No standalone tag-delete endpoint**: Tags are derived from `#hashtag` tokens in memo content—removing or renaming a tag across memos requires listing matching memos (`memo_list_memos`) and updating their `content` (`memo_update_memo`).
- **Structured results & errors**: Successful calls return object-shaped `structuredContent` (empty responses become `{"ok": true}`, collections `{"result": [...]}`). Errors return `IsError: true` with no `structuredContent`.

## Connection Setup

Read [references/setup-and-config.md](references/setup-and-config.md) when connecting a client to `<memos-url>/mcp`, configuring `Authorization: Bearer <token>`, or troubleshooting `403` Origin checks.
