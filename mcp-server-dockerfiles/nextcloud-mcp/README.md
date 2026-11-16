# Nextcloud MCP Server (`nextcloud-mcp`)

Nextcloud Model Context Protocol (MCP) server running the pinned upstream [`ghcr.io/cbcoutinho/nextcloud-mcp-server:0.212.0`](https://github.com/cbcoutinho/nextcloud-mcp-server) image over direct LAN Streamable HTTP (`110` tools across Notes, Tables, WebDAV, Sharing, Calendar/Tasks, Contacts, Cookbook, Deck, and News).

## Endpoints & Security
- **MCP Endpoint (HTTP)**: `http://127.0.0.1:3016/mcp` (`${SSE_PORT:-3016}:8000`)
- **Readiness Endpoint**: `http://127.0.0.1:3016/health/ready`
- **Target Nextcloud Instance**: `https://127.0.0.1` (`the configured host`)
- Authentication uses server-side single-user BasicAuth (`MCP_DEPLOYMENT_MODE=single_user_basic`) with Nextcloud credentials stored in environment variables; no client-side `Authorization` header is required.

## Host Prerequisites (`mcp`, `127.0.0.1`)
- `/data/nextcloud-mcp/data/tokens.db` (`0600`) — persistent SQLite token/state store mounted at `/app/data`

## Required Compose environment variables
Configure in the Compose deployments `environment` block (referencing environment variables):
```env
MCP_DEPLOYMENT_MODE=single_user_basic
NEXTCLOUD_HOST=https://127.0.0.1
NEXTCLOUD_USERNAME=[[NEXTCLOUD_MCP_USERNAME]]
NEXTCLOUD_PASSWORD=[[NEXTCLOUD_PASSWORD]]
NEXTCLOUD_VERIFY_SSL=false
```
