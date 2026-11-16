# Memos Native MCP Tools (36 Curated Tools)

Memos exposes a curated allowlist derived from its embedded OpenAPI spec (`<SubjectService>_<Method>` → `<subject>_<method>`).

## Memos, Comments, Attachments & Relations (14)

| Tool | Notes / Overrides |
| :--- | :--- |
| `memo_list_memos` | List/filter memos (supports CEL `filter`, pagination) |
| `memo_create_memo` | `body.content` required; `visibility` (`PRIVATE`, `PROTECTED`, `PUBLIC`) |
| `memo_get_memo` | Get single memo by `name` (`memos/{id}`) |
| `memo_update_memo` | Partial update: top-level `name`, `body` requires >= 1 property (`name` omitted from `body`). Destructive hint |
| `memo_delete_memo` | Delete memo by `name` |
| `memo_list_memo_comments` | List comments on a memo |
| `memo_create_memo_comment` | `body.content` required |
| `memo_list_memo_attachments` | List attachments linked to a memo |
| `memo_set_memo_attachments` | **Replaces full attachment set** (`body.attachments` required; `name` omitted from `body`) |
| `memo_list_memo_reactions` | List emoji reactions on a memo |
| `memo_upsert_memo_reaction` | `body.reaction` required (`parent` omitted from `body`) |
| `memo_delete_memo_reaction` | Remove a reaction |
| `memo_list_memo_relations` | List memo relations |
| `memo_set_memo_relations` | **Replaces full relation set** (`body.relations` required; `name` omitted from `body`) |

## Attachments (4) & Orientation (2)

| Tool | Notes |
| :--- | :--- |
| `attachment_list_attachments` | List attachments |
| `attachment_create_attachment` | Upload/create attachment (transport allows up to 256 MiB) |
| `attachment_get_attachment` | Get attachment metadata by `name` (`attachments/{id}`) |
| `attachment_delete_attachment` | Delete attachment |
| `user_list_memo_views` | List user's saved CEL filter views |
| `auth_get_current_user` | Read-only "whoami" for the authenticated token |

## Spaces, Members & Invitations (16)

| Tool | Notes / Overrides |
| :--- | :--- |
| `space_list_spaces` / `space_get_space` | Discover spaces |
| `space_create_space` | Create a space |
| `space_update_space` | Partial update: `body` requires >= 1 property (`name` omitted from `body`) |
| `space_delete_space` | **Destructive**: deletes the space and every memo placed in it |
| `space_list_space_members` / `space_get_space_member` | List/inspect space members |
| `space_update_space_member` | `body.role` required (`name`, `user` omitted from `body`) |
| `space_delete_space_member` | Remove a space member |
| `space_list_space_invitations` / `space_list_user_space_invitations` / `space_get_space_invitation` | List/read space invitations |
| `space_create_space_invitation` / `space_delete_space_invitation` | Create or delete an invitation |
| `space_accept_space_invitation` / `space_decline_space_invitation` | `body` is optional (`name` bound from path) |
