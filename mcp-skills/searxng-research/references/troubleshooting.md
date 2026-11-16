# Troubleshooting

First identify which layer returned the error: MCP endpoint, reverse proxy, SearXNG, or the fetched website. A tool can fail inside a successful HTTP response.

## What each check proves
- Tool discovery works: the MCP connection lists tools. Does NOT prove SearXNG is reachable.
- `GET /health` (HTTP mode): that handler is up. Does NOT prove auth, tools, or search.
- `searxng_instance_info`: capability data is available (maybe cached). Does NOT prove JSON search works.
- A search call: that query completed (maybe cached). Does NOT prove every engine is healthy.
- A URL read: that target was readable. Says nothing about SearXNG.

## Search failures from SearXNG
| Symptom | Meaning / next step |
|---|---|
| 401 | Credentials rejected by the SearXNG ingress (Basic Auth settings) |
| 403 | JSON format disabled, or proxy/limiter denied access. Check before changing `search.formats` |
| 404 | Wrong base URL or path prefix in `SEARXNG_URL` |
| 429 | Instance rate limit. Stop rapid retries |
| Non-JSON response | Login/challenge/proxy page replaced JSON. Enable JSON on instances you control |
| TLS error | Configure the trusted CA; do not disable certificate validation |
| DNS / refused / 5xx | Check hostname, network path, service. Larger timeouts won't fix a refusal |

## HTTP transport errors (MCP endpoint)
| Error | Meaning |
|---|---|
| 401 | MCP auth missing/invalid (static token or OAuth). SearXNG Basic Auth is unrelated |
| 403 | Host/Origin not allowlisted, or OAuth scope challenge |
| 404 "Session not found" | Legacy session expired or hit another process; reinitialize |
| 429 / code -32029 | HTTP quota exceeded; wait for window reset |
| 503 "Server busy" | In-flight capacity full; lower concurrency, honor `Retry-After` |
| 504 | Request lifetime expired before headers |

## STDIO / Docker launch
- Node.js 22+ required for NPX.
- `SEARXNG_URL` must reach the child process; Docker needs `-e SEARXNG_URL` too.
- Remove `MCP_HTTP_PORT` from STDIO launches (it switches to HTTP).
- Use `docker run -i --rm` (no `-t`, no `-d`); Compose uses `docker compose run --rm -T`.
- Never write diagnostics to stdout; it carries MCP messages.
- `localhost` inside a container is the container. On Linux Docker add `--add-host=host.docker.internal:host-gateway` to reach a host SearXNG.

## URL reading
| Symptom | Next step |
|---|---|
| Private/internal URL blocked | Default boundary; see URL security settings before allowing |
| Unsupported/oversized | Check content type and byte cap |
| PDF explanation instead of text | Scanned/encrypted PDFs need OCR elsewhere |
| Solver says success but page fails | Solver supplies cookies/UA for a re-fetch; it doesn't return rendered HTML |

## Timeouts
Compare budgets at the failing layer: client tool-call timeout, `SEARXNG_TIMEOUT_MS` (per attempt, replicas and HTML fallback add time), URL fetch/solver/PDF budgets, proxy limits. Reduce concurrency before raising limits.
