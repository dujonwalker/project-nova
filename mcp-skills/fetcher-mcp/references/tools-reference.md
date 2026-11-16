# Fetcher MCP Tools Reference

`fetcher-mcp` exposes **3 tools** backed by headless Playwright Chromium, Mozilla Readability (`@mozilla/readability` + JSDOM), and `turndown` + `turndown-plugin-gfm`.

---

## `fetch_url` (`readOnlyHint: true`)
Retrieve content from a single `http://` or `https://` URL.

- **Required:**
  - `url` (`string`) — must use `http://` or `https://` schema.
- **Optional:**
  - `timeout` (`number`, default `30000`) — navigation timeout in ms. If navigation times out after DOM content has partially loaded, `fetch_url` still attempts to extract available content before failing.
  - `waitUntil` (`string`, default `"load"`) — Playwright load event: `"load"`, `"domcontentloaded"`, `"networkidle"`, or `"commit"`.
  - `extractContent` (`boolean`, default `true`) — extracts main article body via Mozilla Readability (falls back to full HTML if `Readability.parse()` returns `null`).
  - `returnHtml` (`boolean`, default `false`) — returns extracted/full HTML instead of Markdown.
  - `returnText` (`boolean`, default `false`) — returns `document.body.innerText`, skipping Readability extraction, `returnHtml`, and Markdown conversion.
  - `maxLength` (`number`, default `0` / unlimited) — truncates the processed body at `maxLength` characters.
  - `waitForNavigation` (`boolean`, default `false`) — waits up to `navigationTimeout` for a subsequent navigation/redirect after initial load.
  - `navigationTimeout` (`number`, default `10000`) — ms to wait when `waitForNavigation=true`.
  - `disableMedia` (`boolean`, default `true`) — aborts `"image"`, `"stylesheet"`, `"font"`, and `"media"` network requests for faster loading.
  - `debug` (`boolean`) — overrides `--debug` CLI flag; opens non-headless window and skips browser/page cleanup (**do not use on headless servers**).
- **Output format:** `Title: <title>\nURL: <url>\nContent:\n\n<processed body>` (or `<error>...</error>` on failure).

---

## `fetch_urls` (`readOnlyHint: true`)
Concurrently fetch multiple `http://` or `https://` URLs inside a single Chromium context (`Promise.all`).
- **Required:** `urls` (`string[]`, non-empty)
- **Optional:** Same options as `fetch_url` (`timeout`, `waitUntil`, `extractContent`, `maxLength`, `returnHtml`, `returnText`, `waitForNavigation`, `navigationTimeout`, `disableMedia`, `debug`).
- **Output format:** Ordered sections delimited by `[webpage 1 begin] ... [webpage 1 end]`, with any literal boundary markers in fetched pages escaped (`&#91;...&#93;`). Failed URLs return inline `<error>` blocks rather than aborting the whole batch.

---

## `browser_install` (`destructiveHint: true`)
Run `npx playwright install chromium` when Chromium binaries are missing.
- **Optional:**
  - `withDeps` (`boolean`, default `false`) — passes `--with-deps` to install OS libraries (may require root privileges).
  - `force` (`boolean`, default `false`) — passes `--force` even if already installed.
- **When to use:** Only when `fetch_url`/`fetch_urls` raises `BrowserNotInstalledError`.
