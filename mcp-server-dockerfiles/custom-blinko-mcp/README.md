# Blinko MCP Server (`blinko-mcp`)

Model Context Protocol (MCP) server for Blinko notes, flash notes, and todos with stateless Streamable HTTP (`/mcp`) and `/health` endpoints.

## Tools

* `search_blinko_notes` (`searchText`, `page`, `size`, `type`, `orderBy`, `isArchived`, `isRecycle`, `isUseAiQuery`, `startDate`, `endDate`, `hasTodo`)
* `get_blinko_note` (`noteId`)
* `upsert_blinko_flash_note` (`content`, optional `noteId`)
* `upsert_blinko_note` (`content`, optional `noteId`)
* `upsert_blinko_todo` (`content`, optional `noteId`)
* `trash_blinko_note` (`noteId`)
* `share_blinko_note` (`noteId`, optional `password`, `isCancel`)
* `review_blinko_daily_notes` (optional `date`)
* `clear_blinko_recycle_bin`

## Configuration

| Variable | Default | Description |
| --- | --- | --- |
| `BLINKO_URL` | `https://127.0.0.1:8443` | Blinko server base URL (`BLINKO_HOST` / `BLINKO_DOMAIN` also accepted) |
| `BLINKO_TOKEN` | *(required)* | Blinko API Bearer token (injected with Docker Compose `[[BLINKO_TOKEN]]`) |
| `SSE_PORT` | `8442` | Host and container HTTP port |
| `NODE_TLS_REJECT_UNAUTHORIZED` | `0` | Allow Blinko self-signed certificate on LAN |

## Endpoints

* MCP Streamable HTTP: `http://127.0.0.1:8442/mcp`
* Health check: `http://127.0.0.1:8442/health`

## Build & Image

The included Compose configuration builds the Blinko MCP image locally.
