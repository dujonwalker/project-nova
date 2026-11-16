---
name: youtube-mcp
description: Search YouTube videos and channels, retrieve video metadata and transcripts, discover creators, and inspect playlists via the youtube-mcp server. Use when asked to look up YouTube videos, read or search video transcripts/captions, inspect YouTube channels or playlists, find creators by niche or subscriber count, or configure youtube-mcp (stdio or Streamable HTTP). Do not use for casting/playing media on TVs/speakers, downloading video/audio files, or uploading/managing YouTube Studio assets.
---

# YouTube MCP

Query YouTube Data API v3 metadata and transcripts through the `youtube-mcp` server's 10 read-only tools. Keep calls quota-aware and extract raw 11-character IDs before invoking video tools.

## References

- **All 10 tools, parameters, `normalizedMetadata` fields, and quota caveats:** [references/tools-reference.md](references/tools-reference.md)
- **Server transports (`stdio` / Streamable HTTP), API key rotation, and troubleshooting:** [references/setup-and-config.md](references/setup-and-config.md)

## Core Workflows

1. **Video details & transcripts**:
   - Extract the raw 11-character video ID (e.g., `dQw4w9WgXcQ` from `https://www.youtube.com/watch?v=dQw4w9WgXcQ` or `youtu.be/dQw4w9WgXcQ`) — `videos_getVideo` requires a raw `videoId`, whereas `transcripts_getTranscript` accepts either a raw `videoId` or a full YouTube URL.
   - Call `videos_getVideo(videoId=...)` for title, description, tags, duration, and statistics, and `transcripts_getTranscript(videoId=..., language=...)` for captions.
2. **Video search & creator discovery**:
   - Start with `videos_searchVideos(query=..., maxResults=10)` or `channels_findCreators(query=..., sampleVideosPerChannel=3)` to discover videos and channels together.
   - Use `channels_searchChannels(query=...)` for channel handles/names, or `channels_getChannels(channelIds=[...])` to enrich multiple channel IDs in one batch.
3. **Channel uploads & playlists**:
   - To list uploads with minimal API quota, read `normalizedMetadata.uploadsPlaylistId` from `channels_getChannel` / `channels_getChannels`, then call `playlists_getPlaylistItems(playlistId=...)` (instead of the more expensive `channels_listVideos` search call).
   - Use `playlists_getPlaylist(playlistId=...)` and `playlists_getPlaylistItems(playlistId=...)` for curated playlists.

## Critical Caveats

- **All 10 tools are read-only**: No upload, comment, like, subscription, playlist-write, or video-download tools are exposed.
- **`creatorOnly=true` heuristic is strict**: Classifies channels as `"creator"` only if keywords like `"my channel"`, `"streamer"`, or `"reviewer"` match the title/description (`channelTypeHeuristic`). Many real creators classify as `"unknown"`, so omit `creatorOnly` unless explicitly filtering on that heuristic.
- **API quota awareness**: Enabling `uniqueChannels`, subscriber/upload-date filters, or non-default `sortBy` on `videos_searchVideos` (or `includeLatestUpload=true` on channel tools) triggers additional `search.list` calls per channel — keep `maxResults` modest when combining filters.
- **Transcripts require captions**: `transcripts_getTranscript` fails if captions are disabled or unavailable in the requested language (`YOUTUBE_TRANSCRIPT_LANG`, default `'en'`).
