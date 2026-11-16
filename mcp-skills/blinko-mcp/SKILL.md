---
name: blinko-mcp
description: Manage Blinko notes, flash notes, and todos via the blinko-mcp server — search and filter notes, inspect note details, create or update flash notes/notes/todos, run daily reviews, share notes, trash notes, and empty the recycle bin. Use whenever asked to interact with Blinko notes, flash thoughts ("blinkos"), or Blinko todos, or when configuring blinko-mcp-server. Do not use for Memos, TriliumNext, Outline, BookStack, Docmost, Karakeep, or Paperless-ngx.
---

# Blinko MCP

Interact with Blinko notes, flash thoughts, and todos through the `blinko-mcp` server's 9 stateless Streamable HTTP tools.

## References

- **All 9 tools, parameters, defaults, and behavior quirks:** [references/tools-reference.md](references/tools-reference.md)
- **Server environment variables, endpoints (`/mcp`, `/health`), and troubleshooting:** [references/setup-and-config.md](references/setup-and-config.md)

## Blinko Note Types

Blinko distinguishes three content types (`type`):
- `0` — **Flash note** (`upsert_blinko_flash_note`): quick thoughts / scratch capture
- `1` — **Regular note** (`upsert_blinko_note`): structured or long-form notes
- `2` — **Todo** (`upsert_blinko_todo`): actionable tasks (also filterable via `hasTodo=true`)
- `-1` — **All types** (default in `search_blinko_notes`)

## Common Workflows

1. **Find & inspect notes**: Call `search_blinko_notes` (supports `searchText`, `type`, `hasTodo`, `isArchived`, `isRecycle`, `isUseAiQuery`, `startDate`/`endDate` ISO 8601, `page`, `size`, `orderBy`), then `get_blinko_note(noteId=...)` for full content and timestamps.
2. **Capture or update**: Use `upsert_blinko_flash_note`, `upsert_blinko_note`, or `upsert_blinko_todo` without `noteId` to create, or pass `noteId` to update an existing item in place.
3. **Promote a flash note to a regular note**: Read the existing note with `get_blinko_note(noteId=...)` to preserve its full content, then call `upsert_blinko_note(content=..., noteId=...)` to convert it to `type: 1` (or omit `noteId` if you want a new copy instead of modifying the original).
4. **Daily review**: Call `review_blinko_daily_notes()` with no arguments for the daily review queue plus notes created today (UTC), or pass `date="YYYY-MM-DD"` to list notes created on a specific UTC date.

## Safety Boundaries

- **`clear_blinko_recycle_bin` is permanent**: Never invoke it unless the user explicitly confirms permanent deletion of all items in the recycle bin.
- **`trash_blinko_note` soft-deletes**: Moves a note to the recycle bin (discoverable later with `search_blinko_notes(isRecycle=true)`). Confirm the target `noteId` before trashing.
- **`share_blinko_note` creates public links**: Only share (or cancel sharing with `isCancel=true`) when explicitly asked by the user.
