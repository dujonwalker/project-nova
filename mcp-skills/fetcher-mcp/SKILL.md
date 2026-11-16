---
name: fetcher-mcp
description: Fetch web pages and extract readable Markdown, HTML, or plain text using headless Playwright via the fetcher-mcp server. Use when retrieving JavaScript-rendered web pages, batch-fetching multiple URLs in parallel, extracting main article content with Readability, converting web pages to GitHub-Flavored Markdown, or configuring fetcher-mcp transports (/mcp, /sse, stdio). Do not use for interactive authenticated browser automation (form filling, clicks, cookies, network inspection) or API-only JSON/REST services.
---

# Fetcher MCP

Retrieve HTTP/HTTPS web pages rendered in headless Chromium via `fetcher-mcp`'s 3 tools (`fetch_url`, `fetch_urls`, `browser_install`).

## References

- **Tool schemas, extraction pipeline, and parameters:** [references/tools-reference.md](references/tools-reference.md)
- **CLI flags, Streamable HTTP / SSE / OpenAPI transports, and troubleshooting:** [references/setup-and-config.md](references/setup-and-config.md)

## Extraction Workflows

1. **Single page (`fetch_url`)**:
   - Defaults (`extractContent=true`, `returnHtml=false`, `returnText=false`, `disableMedia=true`, `waitUntil="load"`, `timeout=30000`) render JS, run Mozilla Readability, and convert the main article to GitHub-Flavored Markdown.
   - For documentation or SPAs that hydrate asynchronously after initial `load`, pass `waitUntil="networkidle"`.
   - For pages with client-side redirects/interstitials, pass `waitForNavigation=true` (and optionally raise `navigationTimeout`, default `10000` ms).
   - If Readability drops sidebars, navigation tables, or footer links you need, set `extractContent=false` (returns full converted page) or `returnText=true` (`document.body.innerText`, skipping Readability and Markdown conversion).
2. **Multiple pages (`fetch_urls`)**:
   - Pass up to a manageable batch of URLs in `urls` to fetch them concurrently inside one shared Chromium context; responses are wrapped in `[webpage N begin] ... [webpage N end]` delimiters in input order.
3. **Missing browser binary (`browser_install`)**:
   - Only call `browser_install` if `fetch_url`/`fetch_urls` fails with `BrowserNotInstalledError` (Chromium missing). Avoid running it speculatively.

## Guardrails & Caveats

- **Never pass `debug: true` to headless servers**: Opening a visible browser window fails or leaves dangling browser/page instances unclosed on headless hosts/containers.
- **URL protocol restriction**: Only `http://` and `https://` URLs are accepted; `file://` and custom schemes are rejected.
- **`returnText=true` overrides HTML/Readability**: When `returnText=true`, `extractContent` and `returnHtml` are bypassed completely.
- **No session persistence or interactive clicking**: `fetcher-mcp` uses fresh ephemeral browser contexts per call and blocks images/stylesheets/fonts/media by default (`disableMedia=true`). Use browser-automation tools (e.g. Chrome DevTools / CDP) when login sessions, form submissions, clicks, or screenshots are required.
