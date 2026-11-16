# Tool parameters

## searxng_web_search
- `query` (string, required)
- `pageno` (number): starts at 1
- `pages` (int 1-5): fetch consecutive pages concurrently from `pageno`; merged in order and deduplicated. Partial failure sets `failedPages` in JSON; all failing is an error.
- `time_range`: `day` | `week` | `month` | `year`
- `language`: e.g. `en`, `fr`, or `all` (default)
- `safesearch`: `"0"` none, `"1"` moderate, `"2"` strict (default: instance setting)
- `min_score`: 0.0-1.0, filters low-relevance results
- `num_results`: 1-20 (operator ceiling `SEARXNG_MAX_RESULTS` applies)
- `categories`: comma-separated, e.g. `news`, `it,science`
- `engines`: comma-separated, e.g. `google,bing,ddg`, `semantic scholar`
- `response_format`: `text` (agent-readable) or `json` (raw SearXNG JSON)
- `result_detail`: `full` (default) or `compact` (title, url, content only; JSON keys exactly `title`, `url`, `content`)

Full text may add optional lines in fixed order: score, engines, category, published date, thumbnail, image source. Compact text is three lines per result with no cache marker.

## searxng_search_suggestions
- `query` (string, required): partial or complete
- `language`: code or `all`

## searxng_instance_info
- `includeEngines` (bool, default false)
- `includeDisabled` (bool, only with `includeEngines`)
- `category` (string): filter to one category
- `refresh` (bool): bypass capability cache

Reports `common` (on every reachable instance) and `available` (on at least one) for categories, and engines when requested. Defaults, locales, and plugins come from the primary reachable instance.

## web_url_read
- `url` (string, required)
- `startChar` (number, default 0)
- `maxLength` (number)
- `section` (string): extract content under a heading matched by text
- `paragraphRange` (string): `"3"`, `"1-5"`, `"10-"`
- `readHeadings` (bool): headings only, ignores other extraction controls

Handles HTML (to markdown), JSON (pretty-printed), plain text/YAML/TOML/XML, and PDF (up to 500 pages, input and text each capped at min of `URL_READ_MAX_CONTENT_LENGTH_BYTES` and 16 MiB). `maxLength` limits output text only; it does not raise download or PDF limits.
