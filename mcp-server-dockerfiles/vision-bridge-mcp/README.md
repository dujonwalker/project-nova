# Vision Bridge MCP Server (`vision-bridge-mcp`)

Native Streamable HTTP Model Context Protocol (MCP) server built from [`yanuadin/vision-bridge-mcp`](https://github.com/yanuadin/vision-bridge-mcp) (`0.1.2`, commit `4c4a201a`) for `analyze_image` and `ocr_image` backed by Google Gemini (`@google/genai`).

## What `http-transport.patch` Adds
1. **Native Streamable HTTP (`src/http-transport.js`, `src/index.js`)**: Exposes stateless Streamable HTTP (`/mcp`) alongside `/health` and `/healthz` on port `3024` (`MCP_TRANSPORT=streamable-http`), while preserving `stdio` when `MCP_TRANSPORT=stdio`.
2. **Remote Image Inputs (`src/image-utils.js`, `src/server.js`)**: Extends `image_path` in `validateAndReadImage` so HTTP clients on other hosts can pass:
   - `http://` / `https://` image URLs (fetched with `VISION_BRIDGE_MAX_IMAGE_MB` and MIME validation)
   - `data:image/<type>;base64,...` inline data URLs
   - Local filesystem paths (if files are mounted into the container)

## Configuration

| Variable | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | For tool calls | *(empty)* | Google Gemini API key (`[[GEMINI_API_KEY]]` in Komodo; server boots and lists tools without it) |
| `GEMINI_MODEL` | No | `gemini-3.6-flash` | Gemini model ID (override e.g. `gemini-2.5-flash` if needed) |
| `VISION_BRIDGE_MAX_IMAGE_MB` | No | `20` | Maximum image size in MB |
| `SSE_PORT` | No | `3024` | HTTP listen port |
| `MCP_TRANSPORT` | No | `streamable-http` | `streamable-http` or `stdio` |
| `MCP_STATELESS_HTTP` | No | `true` | Stateless Streamable HTTP session handling |

## Build & Deployment
- **Docker build**: Builds the included Vision Bridge MCP image for the configured platform.
- **Compose deployments**: `vision-bridge-mcp` on `mcp` (`127.0.0.1:3024`, `file_paths: ["vision-bridge-mcp/docker-compose.yml"]`)
- **Wiring `GEMINI_API_KEY`**: Create environment variables `GEMINI_API_KEY`, add `GEMINI_API_KEY=[[GEMINI_API_KEY]]` to the `vision-bridge-mcp` Stack environment, and redeploy.

## Endpoints
- MCP Streamable HTTP: `http://127.0.0.1:3024/mcp`
- Healthcheck: `http://127.0.0.1:3024/health` (`GET /healthz` also supported; reports `"gemini_key_configured": true|false`)
