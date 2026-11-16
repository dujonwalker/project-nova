# YouTube MCP Server (`youtube-mcp`)

Model Context Protocol (MCP) server for YouTube video metadata, search, channel/playlist inspection, and transcript extraction using [`zubeid-youtube-mcp-server@1.0.2`](https://www.npmjs.com/package/zubeid-youtube-mcp-server).

## Configuration

| Variable | Default | Description |
| --- | --- | --- |
| `YOUTUBE_API_KEY` | *(required)* | YouTube Data API v3 key (injected with Docker Compose `[[YOUTUBE_API_KEY]]`) |
| `YOUTUBE_TRANSCRIPT_LANG` | `en` | Default language code for transcripts |
| `SSE_PORT` | `3021` | Host and container HTTP port |
| `MCP_TRANSPORT` | `http` | Built-in Streamable HTTP transport |
| `MCP_HOST` | `0.0.0.0` | Bind address |
| `MCP_PORT` | `3021` | Listener port |
| `MCP_STATELESS` | `true` | Stateless Streamable HTTP JSON responses |

## Endpoints

* MCP Streamable HTTP: `http://127.0.0.1:3021/mcp`
* Readiness check: `http://127.0.0.1:3021/ready`

## Build & Image

The included Compose configuration builds the YouTube MCP image locally.
