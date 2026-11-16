# YouTube MCP Setup & Configuration

Configuration reference for `ZubeidHendricks/youtube-mcp-server` (`zubeid-youtube-mcp-server`, Node.js).

## Environment Variables

| Variable | Default | Purpose |
|---|---|---|
| `YOUTUBE_API_KEY` | - | Primary YouTube Data API v3 key (at least one of `YOUTUBE_API_KEY`, `YOUTUBE_API_KEY2`, or `YOUTUBE_API_KEY3` is required at startup) |
| `YOUTUBE_API_KEY2` | unset | Secondary fallback key used automatically if key 1 hits quota/rate-limit errors |
| `YOUTUBE_API_KEY3` | unset | Tertiary fallback key for quota rotation |
| `YOUTUBE_TRANSCRIPT_LANG` | `en` | Default language code used by `transcripts_getTranscript` when `language` is omitted |
| `MCP_TRANSPORT` | `stdio` (Docker image sets `http`) | Transport mode: `stdio` or `http` (Streamable HTTP) |
| `MCP_HOST` | `0.0.0.0` (HTTP mode) | Bind host for HTTP transport |
| `MCP_PORT` | `8088` (HTTP mode) | Bind port for HTTP transport |
| `MCP_STATELESS` | `true` (HTTP mode) | Uses stateless JSON responses (`enableJsonResponse: true`) unless explicitly set to `"false"` for UUID session mode |

### Quota Rotation Pool
On startup, the server validates that at least one of `YOUTUBE_API_KEY`, `YOUTUBE_API_KEY2`, or `YOUTUBE_API_KEY3` is set. When a YouTube Data API v3 request fails with a quota or rate-limit error (`quotaExceeded`, `dailyLimitExceeded`, `dailyLimitExceededExceeded`, `userRateLimitExceeded`, `rateLimitExceeded`), the server marks that key exhausted in memory and immediately retries with the next configured key.

---

## Transports

### 1. Local `stdio` (npx / Node)
```json
{
  "mcpServers": {
    "youtube": {
      "command": "npx",
      "args": ["-y", "zubeid-youtube-mcp-server"],
      "env": {
        "YOUTUBE_API_KEY": "your_primary_key",
        "YOUTUBE_API_KEY2": "optional_backup_key",
        "YOUTUBE_TRANSCRIPT_LANG": "en"
      }
    }
  }
}
```

### 2. Streamable HTTP (`MCP_TRANSPORT=http`)
- **MCP Endpoint:** `http://<host>:<port>/mcp`
- **Readiness Endpoint:** `http://<host>:<port>/ready` (returns HTTP `200` JSON `{"status":"ok","transport":"http","stateless":true}`)
- **Docker defaults:** `MCP_TRANSPORT=http`, `MCP_HOST=0.0.0.0`, `MCP_PORT=8088`, `MCP_STATELESS=true`.

```bash
docker run -d -p 8088:8088 \
  -e YOUTUBE_API_KEY=... \
  -e MCP_TRANSPORT=http \
  youtube-mcp-server
```

*(Note: the upstream `Dockerfile` copies `.env` into `/app/.env` during image build if present; in containerized deployments prefer injecting API keys at runtime via container environment variables.)*

---

## Troubleshooting

- **Tool errors about missing video / 404**: Confirm you passed the raw 11-character `videoId` rather than a full `https://www.youtube.com/watch?v=...` URL.
- **Empty results with `creatorOnly=true`**: `channelTypeHeuristic` matches explicit creator/brand keywords in the channel's title and description; many channels fall back to `"unknown"`. Retry without `creatorOnly=true`.
- **Quota exhausted errors**: Check `YOUTUBE_API_KEY` quota in Google Cloud Console or add `YOUTUBE_API_KEY2` / `YOUTUBE_API_KEY3` for automatic key failover; reduce `maxResults`, pass `includeLatestUpload=false` in `channels_getChannels`, or use `uploadsPlaylistId` + `playlists_getPlaylistItems` instead of `channels_listVideos`.
- **Transcript unavailable**: Some videos disable captions or lack the requested language track (`language` parameter). Check `videos_getVideo` description/details when transcripts are disabled.
