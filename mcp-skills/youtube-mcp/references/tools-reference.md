# YouTube MCP Tools Reference

`youtube-mcp` (`zubeid-youtube-mcp-server`) exposes **10 read-only tools** across videos, transcripts, channels, and playlists.

> **ID format:** Pass raw YouTube IDs (`videoId`, `channelId`, `playlistId`) to Data API tools (`videos_getVideo`, `channels_*`, `playlists_*`). `transcripts_getTranscript` accepts either a raw 11-character `videoId` or a full YouTube URL.

---

## 1. Videos

### `videos_getVideo`
Get detailed metadata for a single video via `youtube.videos.list`.
- **Required:** `videoId` (`string`)
- **Optional:** `parts` (`string[]`, defaults to `["snippet", "contentDetails", "statistics"]`; other valid API parts include `"status"`, `"topicDetails"`, `"liveStreamingDetails"`)
- **Returns:** First matching video resource object, or `null` if not found.

### `videos_searchVideos`
Search YouTube videos (`youtube.search.list`), optionally enriched and filtered by channel attributes.
- **Required:** `query` (`string`)
- **Optional:**
  - `maxResults` (`number`, default `10`)
  - `order` (`string`, default `"relevance"`, e.g. `"date"`, `"rating"`, `"viewCount"`, `"title"`)
  - `publishedAfter` / `publishedBefore` (`string`, ISO 8601 timestamp)
  - `channelId` (`string`)
  - `uniqueChannels` (`boolean`, default `false`) — keep at most one video per channel
  - `channelMinSubscribers` / `channelMaxSubscribers` (`number`)
  - `channelLastUploadAfter` / `channelLastUploadBefore` (`string`, ISO 8601 timestamp)
  - `creatorOnly` (`boolean`, default `false`) — keeps only `channelTypeHeuristic === "creator"`
  - `sortBy` (`string`, default `"relevance"`): `"relevance"`, `"subscribers_asc"`, `"subscribers_desc"`, `"indie_priority"` (sorts by `subscriberCount` ascending), `"recent_activity"`
- **Quota note:** Passing any channel filter (`uniqueChannels`, `creatorOnly`, subscriber bounds, `channelLastUpload*`, or `sortBy !== "relevance"`) triggers `channels.list` plus one `search.list` call per unique matched channel (`latestVideoPublishedAt`) and appends `channelMetadata` + `latestChannelUploadAt` to each item.

---

## 2. Transcripts

### `transcripts_getTranscript`
Fetch captions/transcript segments for a video (`youtube-transcript` scraper; does not consume YouTube Data API quota).
- **Required:** `videoId` (`string`)
- **Optional:** `language` (`string`, defaults to `YOUTUBE_TRANSCRIPT_LANG` or `"en"`)
- **Returns:** `{ videoId, language, transcript: [{ text, duration, offset, lang }, ...] }`.
- **Errors:** Throws if transcripts are disabled, private/unavailable, or missing for the requested language.

---

## 3. Channels

### Channel Enrichment & `normalizedMetadata`
`channels_getChannel`, `channels_getChannels`, `channels_searchChannels`, and `channels_findCreators` normalize each channel with:
- `latestVideoPublishedAt` (when `includeLatestUpload` is enabled)
- `normalizedMetadata`:
  - `channelId`, `title`, `description`, `customUrl`, `url`, `country`, `defaultLanguage`, `joinedAt`
  - `uploadsPlaylistId` — the channel's uploads playlist ID (`UU...`), directly usable with `playlists_getPlaylistItems`
  - `subscriberCount`, `videoCount`, `viewCount`
  - `emailsFound`, `contactLinks` (parsed from channel description text; `businessEmail` is always `null` because YouTube Data API v3 does not expose it)
  - `channelTypeHeuristic` (`"creator"` | `"brand_or_media"` | `"unknown"`), `brandKeywordHits`, `creatorKeywordHits`, `heuristicConfidence`

### `channels_getChannel`
Fetch enriched metadata (including `latestVideoPublishedAt` and `normalizedMetadata`) for one channel.
- **Required:** `channelId` (`string`)

### `channels_getChannels`
Batch fetch enriched metadata for multiple channels in one call.
- **Required:** `channelIds` (`string[]`)
- **Optional:**
  - `parts` (`string[]`, schema property; enrichment fetches `["snippet", "statistics", "contentDetails", "brandingSettings"]`)
  - `includeLatestUpload` (`boolean`, default `true` — set `false` to avoid per-channel `search.list` calls)

### `channels_searchChannels`
Search channels by handle, name, or query, then enrich, filter, and rank them.
- **Required:** `query` (`string`)
- **Optional:** `maxResults` (`number`, default `5`), `order` (`string`, default `"relevance"`), `channelType` (`"any"` | `"show"`), `minSubscribers` / `maxSubscribers` (`number`), `lastUploadAfter` / `lastUploadBefore` (`string`, ISO 8601), `creatorOnly` (`boolean`, default `false`), `sortBy` (`"relevance"` | `"subscribers_asc"` | `"subscribers_desc"` | `"indie_priority"` | `"recent_activity"`).

### `channels_findCreators`
Search videos by topic/mention, group matched videos by channel, enrich those channels, and return ranked creator profiles with `matchCount` and `matchedVideos`.
- **Required:** `query` (`string`)
- **Optional:** `maxResults` (`number`, default `10` video matches scanned), `order` (`"relevance"` | `"date"`), `videoPublishedAfter` / `videoPublishedBefore` (`string`, ISO 8601), `channelMinSubscribers` / `channelMaxSubscribers` (`number`), `channelLastUploadAfter` / `channelLastUploadBefore` (`string`, ISO 8601), `creatorOnly` (`boolean`, default `false`), `sortBy` (`string`, default `"relevance"`), `sampleVideosPerChannel` (`number`, default `3`).

### `channels_listVideos`
List latest videos from a channel via `youtube.search.list(order="date", type=["video"])`.
- **Required:** `channelId` (`string`)
- **Optional:** `maxResults` (`number`, default `50`)
- **Quota tip:** For routine upload listing, prefer reading `normalizedMetadata.uploadsPlaylistId` from `channels_getChannel` and calling `playlists_getPlaylistItems` (`playlistItems.list` costs 1 API quota unit vs 100 units for `search.list`).

---

## 4. Playlists

### `playlists_getPlaylist`
Fetch playlist snippet and item count (`contentDetails`).
- **Required:** `playlistId` (`string`)

### `playlists_getPlaylistItems`
List items in a playlist (`snippet`, `contentDetails`).
- **Required:** `playlistId` (`string`)
- **Optional:** `maxResults` (`number`, default `50`)
