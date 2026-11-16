# Playwright MCP Tools Reference

All tools exposed by `@playwright/mcp` (`v0.0.85`). Core automation and tab management (25 tools) are active by default; additional groups require `--caps=<group>` (or `capabilities` in `--config`).

## Snapshot-First Targeting Pattern

Most element-interaction tools accept:
- `target` (string): Exact target element reference from `browser_snapshot` / `browser_find`, or a unique element selector.
- `element` (string, optional unless noted): Human-readable element description used for permission prompts and audit clarity.

When a page is large, call `browser_find` with `text` or `regex` first, or pass `depth` / `target` to `browser_snapshot` to keep token usage small.

---

## Core Automation (Default — 24 tools)

| Tool | Read-Only | Required Parameters | Optional Parameters & Defaults | Purpose |
|---|---|---|---|---|
| `browser_navigate` | false | `url` | — | Navigate current tab to URL |
| `browser_navigate_back` | false | — | — | Go back in browser history |
| `browser_close` | false | — | — | Close the current page |
| `browser_snapshot` | true | — | `target`, `filename`, `depth`, `boxes` | Capture accessibility tree (preferred over screenshot) |
| `browser_find` | true | — | `text` OR `regex`, `maxResults`, `filename` | Search accessibility snapshot with context snippets |
| `browser_click` | false | `target` | `element`, `doubleClick`, `button` (default left), `modifiers` | Click/double-click an element |
| `browser_hover` | false | `target` | `element` | Hover cursor over an element |
| `browser_drag` | false | `startTarget`, `endTarget` | `startElement`, `endElement` | Drag and drop between two elements |
| `browser_drop` | false | `target` (+ `paths` or `data`) | `element`, `paths` (abs paths), `data` (MIME→string map) | Drop external files or MIME data onto element |
| `browser_type` | false | `target`, `text` | `element`, `submit`, `slowly` | Type text into editable element (`slowly` triggers per-key handlers) |
| `browser_fill_form` | false | `fields` (array) | — | Fill multiple form fields in one call |
| `browser_select_option` | false | `target`, `values` (array) | `element` | Select one or more dropdown option values |
| `browser_press_key` | false | `key` | — | Press keyboard key or character (e.g. `ArrowLeft`, `a`) |
| `browser_file_upload` | false | — | `paths` (abs paths; omit to cancel chooser) | Respond to file chooser with files or cancel |
| `browser_handle_dialog` | false | `accept` (boolean) | `promptText` | Accept/dismiss alert, confirm, or prompt dialog |
| `browser_wait_for` | false | — | `time` (sec, max 30; timeout if combined), `text`, `textGone` | Wait for text appearance/disappearance or duration |
| `browser_resize` | false | `width`, `height` | — | Resize browser viewport/window |
| `browser_emulate_media` | false | — | `colorScheme`, `reducedMotion`, `forcedColors`, `contrast`, `media` | Emulate CSS media features (`null` clears override) |
| `browser_evaluate` | false | `function` | `element`, `target`, `filename` | Run `() => ...` on page or `(el) => ...` on target element |
| `browser_run_code_unsafe` | false | — | `code` OR `filename` | **Unsafe**: run arbitrary Playwright JS `async (page) => ...` in server process |
| `browser_console_messages` | true | `level` (default `"info"`) | `all` (default false), `filename` | Return console messages (`error`\|`warning`\|`info`\|`debug`) |
| `browser_network_requests` | true | `static` (default false) | `filter` (regexp), `all` (default false), `filename` | List numbered network requests since load/session start |
| `browser_network_request` | true | `index` (1-based) | `part`, `filename` | Inspect headers/body of one request from `browser_network_requests` |
| `browser_take_screenshot` | true | `scale` (default `"css"`) | `element`, `target`, `type`, `filename`, `fullPage` | Capture viewport, full-page, or element image (`"css"` or `"device"` scale) |

## Tab Management (Default — 1 tool)

| Tool | Read-Only | Required Parameters | Optional Parameters | Purpose |
|---|---|---|---|---|
| `browser_tabs` | false | `action` (`list`\|`new`\|`close`\|`select`) | `index` (close/select), `url` (new), `isolatedContext` (named isolated cookie/storage context) | List, open, close, or switch browser tabs & contexts |

---

## Opt-In Capabilities (`--caps=...`)

### `--caps=config` (1 tool)
- `browser_get_config` (read-only: true, params: none) — Return final resolved server configuration (CLI + env + config file).

### `--caps=pdf` (1 tool)
- `browser_pdf_save` (read-only: true, params: `filename` optional) — Save current page as PDF (defaults to `page-{timestamp}.pdf` in output dir).

### `--caps=vision` (6 tools — coordinate fallback)
Use screenshot coordinates when canvas, WebGL, or non-semantic widgets lack ARIA snapshot nodes.
- `browser_mouse_click_xy` (read-only: false) — `x`, `y`, optional `button`, `clickCount` (default 1), `delay` (ms, default 0)
- `browser_mouse_move_xy` (read-only: false) — `x`, `y`
- `browser_mouse_drag_xy` (read-only: false) — `startX`, `startY`, `endX`, `endY`
- `browser_mouse_down` / `browser_mouse_up` (read-only: false) — optional `button`
- `browser_mouse_wheel` (read-only: false) — `deltaX`, `deltaY`

### `--caps=network` (4 tools)
- `browser_network_state_set` (read-only: false) — `state` (`"offline"` \| `"online"`)
- `browser_route` (read-only: false) — `pattern` (URL glob/pattern), optional `status` (default 200), `body`, `contentType`, `headers` (`"Name: Value"` array), `removeHeaders` (comma-separated)
- `browser_route_list` (read-only: true) — no params
- `browser_unroute` (read-only: false) — optional `pattern` (omit to clear all routes)

### `--caps=storage` (17 tools)
- **Cookies**: `browser_cookie_list` (RO, `domain`?, `path`?), `browser_cookie_get` (RO, `name`), `browser_cookie_set` (`name`, `value`, `domain`?, `path`?, `expires`?, `httpOnly`?, `secure`?, `sameSite`?), `browser_cookie_delete` (`name`, `domain`?, `path`?), `browser_cookie_clear`
- **localStorage**: `browser_localstorage_list` (RO), `browser_localstorage_get` (RO, `key`), `browser_localstorage_set` (`key`, `value`), `browser_localstorage_delete` (`key`), `browser_localstorage_clear`
- **sessionStorage**: `browser_sessionstorage_list` (RO), `browser_sessionstorage_get` (RO, `key`), `browser_sessionstorage_set` (`key`, `value`), `browser_sessionstorage_delete` (`key`), `browser_sessionstorage_clear`
- **Storage State**: `browser_storage_state` (RO, optional `filename` → `storage-state-{timestamp}.json`), `browser_set_storage_state` (`filename` — clears existing cookies/localStorage before restoring)

### `--caps=devtools` (13 tools)
- `browser_annotate` (RO) — Open Playwright Dashboard annotation mode and wait for user annotations
- `browser_highlight` (RO) / `browser_hide_highlight` (RO) — Toggle persistent highlight overlay around `target` (`style` optional)
- `browser_resume` (`step`?, `location`?) — Resume paused script execution
- `browser_start_recording` (RO) / `browser_stop_recording` (RO) — Record manual user flow and return Playwright code
- `browser_start_tracing` (RO) / `browser_stop_tracing` (RO) — Start/stop Playwright trace capture
- `browser_start_video` (RO, `filename`?, `size`?, `fps` default 25, `cursor`?) / `browser_stop_video` (RO) — Capture `.webm` video
- `browser_video_chapter` (RO, `title`, `description`?, `duration`?) — Insert full-screen blurred chapter card in video
- `browser_video_show_actions` (RO, `duration` default 500, `position` default top-right, `cursor`?, `style`?) / `browser_video_hide_actions` (RO) — Toggle action callout overlays

### `--caps=testing` (5 tools)
- `browser_generate_locator` (RO) — `target`, optional `element` → test locator
- `browser_verify_element_visible` (RW) — `role`, `accessibleName`
- `browser_verify_list_visible` (RW) — `element`, `target`, `items` (array)
- `browser_verify_text_visible` (RW) — `text` (prefer `browser_verify_element_visible` when possible)
- `browser_verify_value` (RW) — `type`, `element`, `target`, `value` (`"true"`/`"false"` for checkboxes)
