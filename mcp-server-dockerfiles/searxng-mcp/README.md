# SearXNG MCP Server (`searxng-mcp`)

Uses the official pre-built [`isokoliuk/mcp-searxng:2.10.1`](https://github.com/ihor-sokoliuk/mcp-searxng) image running native **Streamable HTTP** (`MCP_HTTP_PORT=3023`, `MCP_HTTP_STATELESS=true`, `MCP_HTTP_HOST=0.0.0.0`) targeting the self-hosted SearXNG instance on `the configured host` (`http://127.0.0.1:8080`).

## Endpoints
- **MCP Endpoint**: `http://127.0.0.1:3023/mcp`
- **Healthcheck Endpoint**: `http://127.0.0.1:3023/health`
- **Target SearXNG Instance**: `http://127.0.0.1:8080` (`the configured host` `searxng-core`, JSON search enabled)

## Exposed Tools
- `searxng_web_search`: Aggregated search with pagination, language/category/time/safesearch filters, and compact/full output
- `searxng_search_suggestions`: Query autocomplete/suggestions
- `searxng_instance_info`: Available categories, engines, and instance defaults
- `web_url_read`: Fetch and extract HTML, structured text, and bounded PDF text

## Configuration
All defaults are configured in [`docker-compose.yml`](./docker-compose.yml) and can be overridden via the Compose deployments `environment` block (e.g., `SEARXNG_URL`, `MCP_HTTP_HARDEN`, `MCP_HTTP_AUTH_TOKEN`, `MCP_HTTP_ALLOWED_HOSTS`, `MCP_HTTP_ALLOWED_ORIGINS`).
