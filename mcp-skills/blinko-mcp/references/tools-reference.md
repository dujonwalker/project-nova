# Blinko MCP Tools Reference

`blinko-mcp-server` exposes **9 tools** backed by Blinko's `/api/v1/note/*` REST endpoints (`noteId` is always a numeric `number`).

---

## Read & Discovery Tools

### `search_blinko_notes`
Search and filter notes, flash notes, and todos via `POST /api/v1/note/list`.
- **Optional parameters:**
  - `searchText` (`string`, default `""`) — keyword query; may be empty when filtering by other fields
  - `page` (`number`, default `1`, 1-indexed)
  - `size` (`number`, default `10`)
  - `type` (`number`, default `-1`): `-1` (all), `0` (flash), `1` (regular), `2` (todo)
  - `orderBy` (`"asc"` | `"desc"`, default `"desc"`)
  - `isArchived` (`boolean`, default `false`)
  - `isRecycle` (`boolean`, default `false`) — set `true` to inspect soft-deleted notes in the recycle bin
  - `isUseAiQuery` (`boolean`, default `false`) — uses Blinko semantic/AI search when configured on the Blinko instance
  - `startDate` / `endDate` (`string`, ISO 8601, default `null`)
  - `hasTodo` (`boolean`, default `false`)
- **Returns:** Formatted list of `**Note ID <id>** (Flash|Regular|Todo): ...`, or `Found 0 note(s)...`.

### `get_blinko_note`
Fetch full note details via `POST /api/v1/note/detail`.
- **Required:** `noteId` (`number`)
- **Returns:** `**Note ID <id>** (<Type>, created <createdAt>):\n<content>` or `Note ID <id> not found`.

### `review_blinko_daily_notes`
Retrieve daily review items and/or notes created on a UTC date.
- **Optional:** `date` (`string`, `YYYY-MM-DD`, UTC)
- **Behavior:**
  - When `date` is **omitted**: calls `GET /api/v1/note/daily-review-list` and `POST /api/v1/note/list` (`size: 50`), returning both the daily review queue and any of the latest 50 notes created today (UTC).
  - When `date` is **provided**: fetches the latest 50 notes (`type: -1`) and filters client-side by `createdAt.startsWith(date)`. *(Note: notes outside the most recent 50 items are not included by this filter; use `search_blinko_notes(startDate=..., endDate=...)` for older ranges.)*

---

## Write Tools

### `upsert_blinko_flash_note` (type `0`) / `upsert_blinko_note` (type `1`) / `upsert_blinko_todo` (type `2`)
Create or update a flash note, regular note, or todo via `POST /api/v1/note/upsert`.
- **Required:** `content` (`string`)
- **Optional:** `noteId` (`number`) — omit to create a new entry; provide an existing ID to update its content and set its note type.
- **Returns:** Confirmation text including the resulting note ID.

### `share_blinko_note`
Create, password-protect, or revoke a public share link via `POST /api/v1/note/share`.
- **Required:** `noteId` (`number`)
- **Optional:** `password` (`string`), `isCancel` (`boolean`, default `false`)
- **Returns:** Share confirmation and URL (`<BLINKO_BASE_URL>/share/<shareEncryptedUrl>` or `shareLink`) when enabled, or cancellation confirmation when `isCancel=true`.

---

## Destructive Tools

### `trash_blinko_note`
Soft-delete a single note to the recycle bin via `POST /api/v1/note/batch-trash`.
- **Required:** `noteId` (`number`)
- **Recovering/inspecting trashed notes:** Use `search_blinko_notes(isRecycle=true)`.

### `clear_blinko_recycle_bin`
Permanently delete every note currently in Blinko's recycle bin via `POST /api/v1/note/clear-recycle-bin`.
- **Parameters:** None (`{}`)
- **Warning:** Irreversible operation; always verify intent and confirm explicitly with the user beforehand.
