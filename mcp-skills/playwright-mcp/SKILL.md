---
name: playwright-mcp
description: Automate and inspect web pages in a real browser through Playwright MCP (`playwright-mcp`) — navigate URLs, read accessibility-tree snapshots, locate elements, click, type, fill forms, manage tabs/contexts, inspect console logs and network traffic, take screenshots, mock routes, manage cookies/storage, export PDFs, or record traces/video. Use for interactive multi-step browser workflows, web app debugging, form submission, authenticated session setup, or JS-heavy UI verification whenever `playwright-mcp` tools are available. Do not use for simple read-only webpage-to-Markdown extraction (prefer `fetcher-mcp`) or host-desktop/signed-in remote Chrome WebSocket scripts unless explicitly targeting `playwright-mcp`.
---

# Playwright MCP

Control a browser through structured accessibility snapshots rather than brittle CSS selectors or pixel-guessing. Every action starts by observing the accessibility tree (`browser_snapshot` or `browser_find`) and targeting elements by their snapshot `target` ref (or a unique selector).

## Core Workflow

1. **Navigate**: Call `browser_navigate` with `url`, or open a separate tab/context with `browser_tabs` (`action: "new"`, optional `isolatedContext`).
2. **Inspect via snapshot**: Call `browser_snapshot` (use `depth` or `target` to scope large pages, or `browser_find` with `text`/`regex` to locate a ref cheaply).
3. **Act with `target` refs**: Pass the snapshot `target` (plus human-readable `element` when helpful) to `browser_click`, `browser_type`, `browser_fill_form`, `browser_select_option`, `browser_hover`, `browser_drag`, `browser_drop`, or `browser_file_upload`.
4. **Wait & verify**: Use `browser_wait_for` (`text`, `textGone`, or `time` up to 30s) for async UI updates, then re-snapshot because DOM changes invalidate prior refs.
5. **Debug & capture**: Inspect `browser_console_messages`, `browser_network_requests` → `browser_network_request`, `browser_evaluate`, or `browser_take_screenshot`.

## Capability Groups

Core automation + tab management (25 `browser_*` tools) are enabled by default. Additional groups require server `--caps` opt-in (`config`, `network`, `storage`, `devtools`, `vision`, `pdf`, `testing`):

- **Default (`core` + tab management)**: Navigation, accessibility snapshots/search, clicks, typing, forms, uploads/drops, dialogs, media emulation, JS evaluation, screenshots, console, and network inspection.
- **`--caps=vision`**: Coordinate-based mouse fallback (`browser_mouse_click_xy`, `browser_mouse_move_xy`, `browser_mouse_drag_xy`, `browser_mouse_down`, `browser_mouse_up`, `browser_mouse_wheel`) for canvas/non-ARIA UIs after a screenshot.
- **`--caps=pdf` / `network` / `storage` / `devtools` / `testing` / `config`**: `browser_pdf_save`, route mocking & offline simulation, cookie/WebStorage/storage-state tools, video/trace/action recording & annotations, Playwright locator/assertion helpers, and `browser_get_config`.

## Guardrails

- Prefer `browser_snapshot` and `browser_find` over screenshots unless visual layout inspection or `--caps=vision` coordinates are required.
- Avoid `browser_run_code_unsafe` unless standard `browser_*` tools and `browser_evaluate` cannot express the action (it executes arbitrary JS in the MCP server process).
- Re-snapshot after navigation, modal open/close, or form submission before reusing any `target` ref.
- Never assume opt-in capability tools (`browser_pdf_save`, `browser_route`, `browser_cookie_*`, `browser_mouse_*`, etc.) are active unless enabled on the server.

## References

- [references/tools-reference.md](references/tools-reference.md): Complete 72-tool catalog by capability group with parameters, defaults, and read-only flags.
- [references/setup-and-config.md](references/setup-and-config.md): Transport modes (`stdio` and standalone HTTP `/mcp`), Docker `ENTRYPOINT` & `--allowed-hosts` gotchas, `--caps`, profiles, and `PLAYWRIGHT_MCP_*` environment variables.
