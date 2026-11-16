---
name: searxng-research
description: Use the mcp-searxng MCP server tools (searxng_web_search, searxng_search_suggestions, searxng_instance_info, web_url_read) to search the web, read pages and PDFs, and answer questions with cited evidence. Use this skill whenever the user asks to look something up, research a topic, verify a claim, find current information, read a URL, or summarize a web page or PDF and these tools are available, even if they don't mention SearXNG. Also use it when a SearXNG search returns empty, degraded, or surprising results and needs troubleshooting.
compatibility: Requires the mcp-searxng MCP server connected to a SearXNG instance with JSON search enabled. Tool names may carry a client-specific prefix.
---

# Research with mcp-searxng

Four tools. Pick the one that advances the task; most tasks need only two.

| Need | Tool |
|---|---|
| Source URL unknown, or want several perspectives | `searxng_web_search` |
| Query is vague or terminology uncertain | `searxng_search_suggestions` |
| Plan depends on a specific category/engine/locale | `searxng_instance_info` |
| Have a URL and need its content | `web_url_read` |

## Workflow

1. **Define the need.** Note the question, required freshness, and what counts as sufficient evidence. Separate facts from opinions and forecasts.
2. **Search with the bare query first.** Call `searxng_web_search` with `query` (and `num_results` if useful). Add filters only after seeing results, one at a time.
3. **Select sources before reading.** Prefer primary sources (official docs, laws, papers, first-party announcements). Syndicated copies and several pages from one organization are not independent confirmation.
4. **Read the pages that matter.** A snippet is discovery evidence, not proof of what the page says. Call `web_url_read` for every source supporting a material claim.
5. **Cross-check.** Confirm material claims against a genuinely independent source, or say why only one authoritative source exists. If sources conflict, report the conflict and check whether date, version, or method explains it.
6. **Answer with citations.** Cite the canonical URL next to each claim. Label each statement as evidence (a source says it), inference (you combined sources), or unknown (not established). Never invent a quote, date, or citation.

## Effort budget

| Task | Search rounds | Pages read |
|---|---|---|
| Small factual check | 1 | 1-2 |
| Normal research | 2-3 | 3-6 |
| High-impact claim | 3-5 | 5-10 |

Run independent queries or reads in parallel (2-4 at once). Keep dependent steps sequential: find a URL before reading it, check `searxng_instance_info` before relying on a category or engine. Stop when the question is answered, claims are cited or labeled, and another round is unlikely to change the conclusion. If access is blocked or the budget is hit, report the limitation instead of retrying indefinitely.

## Reading long pages

1. Call `web_url_read` with `readHeadings=true` **alone** (it ignores other extraction options).
2. Then a separate call with `section`, `paragraphRange` (`"3"`, `"1-5"`, `"10-"`), or `startChar` + `maxLength`.

PDFs return extracted text only (no OCR). Scanned or encrypted PDFs return a short explanation; try another source.

## Gotchas

- **`engines` + `time_range` together** requires every instance to report per-engine time-range support, otherwise the call fails before searching. Drop one of them, or check `searxng_instance_info` first.
- **Prefer `common` over `available`** capabilities from `searxng_instance_info` when several replicas are configured; `available` values may work on only some.
- **Default `result_detail` is `full`.** Use `compact` (title, URL, snippet only) to save tokens on broad scans; switch back to `full` when you need answers, infoboxes, warnings, scores, dates, or engine-failure detail.
- **`Search Degraded` with `isError: true`** means zero rows plus reported engine failures. It does not mean every engine failed. Retry later with different engines; do not hammer a public instance.
- **Results can be cached** per process. Repeated identical calls may return old data. There is no per-call cache bypass; `refresh=true` on `searxng_instance_info` refreshes capabilities only.
- **Private/internal URLs are blocked** by `web_url_read` by default (including via redirects). Don't try to work around it.
- **Binary content is rejected.** Media, archives, and octet-streams are not readable; pick a different source.
- **PDF busy message** ("PDF text extraction is busy") means two parsers are already running. Retry later with lower concurrency.
- **Lite mode** (`SEARXNG_LITE_TOOLS=true`) hides optional parameters from the schema. If you cannot see `time_range` or `section`, they may still be accepted when sent explicitly.
- **Suggestions are query ideas, not evidence.** Never cite them.

## When results are poor or empty

Change one constraint at a time, in this order:

1. Drop unnecessary words or try a synonym.
2. Remove `time_range`.
3. Set `language` to `all`.
4. Remove `categories` / `engines`.
5. Broaden the question, then search narrower sub-questions separately.

Retries do not guarantee useful results; engine quality is instance-dependent.

## Privacy

Queries and fetched URLs go to the SearXNG instance and possibly upstream engines. Never put secrets, credentials, private identifiers, or confidential text in a query. Strip unnecessary personal data.

## References

- Full parameter list for all four tools: read `references/tool-parameters.md` when you need an argument you don't remember.
- Server or connection errors (401/403/404/429/503, timeouts, STDIO/Docker problems, non-JSON responses): read `references/troubleshooting.md`.
