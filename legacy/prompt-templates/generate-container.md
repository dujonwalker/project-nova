# Containerizing a Model Context Protocol (MCP) Server for n8n (Streamable HTTP)

I need help containerizing a Model Context Protocol (MCP) server and exposing it over the **Streamable HTTP** transport (`/mcp`) so it can be used with n8n's native MCP Client Tool nodes (`httpStreamable`).

> **Important**: Before generating the solution, please ask me for:
> 1. The host IP address where the MCP server will run
> 2. The port on which the Streamable HTTP (`/mcp`) endpoint should be exposed
> 3. If you need to see any specific files from the MCP server repository to understand how it works
> 4. Any other information you need to create a working containerized solution
>
> **CRITICAL**: This task is to containerize the EXACT MCP server I provide. Do NOT create alternative implementations or substitutes under any circumstances. If you encounter difficulties, ask for more information rather than inventing alternatives.

## Background Information

### What is MCP?
The Model Context Protocol (MCP) is a standardized interface for AI models to interact with external tools and services. It provides a consistent way for AI assistants to discover and use tools.

### What is n8n?
n8n is a workflow automation platform that supports MCP through its built-in "MCP Client Tool" node (`@n8n/n8n-nodes-langchain.mcpClientTool`) using the `httpStreamable` transport.

### Transport Strategy (Streamable HTTP `/mcp`)
Modern MCP uses the **Streamable HTTP** transport (`/mcp`), replacing the deprecated `HTTP+SSE` (`/sse` + `/message`) transport.

Choose the cleanest approach supported by the target MCP server:
1. **Native Streamable HTTP (Preferred)**: If the server natively supports Streamable HTTP (e.g., `--transport http`, `--transport streamable-http`, `MCP_TRANSPORT=http`, or `FastMCP.run(transport="streamable-http")`), run it directly on `0.0.0.0:<PORT>` serving `/mcp`.
2. **Python `StreamableHTTPSessionManager` (For Python MCP servers)**: Mount the server's `mcp._mcp_server` or low-level `mcp.server.Server` instance using `from mcp.server.streamable_http_manager import StreamableHTTPSessionManager` with `uvicorn` on `/mcp` and `/health`.
3. **Node.js `@modelcontextprotocol/sdk` `StreamableHTTPServerTransport` (For Node MCP servers)**: Mount the server (or wrap a stdio server using `Client` + `StdioClientTransport` + `Server` + `StreamableHTTPServerTransport`) from `@modelcontextprotocol/sdk/server/streamableHttp.js` on `/mcp` and `/health`.

Do **not** use third-party proxy gateways; rely strictly on native server flags or the official `@modelcontextprotocol/sdk` / Python `mcp` SDK.

## My Self-Hosted Environment

- n8n server IP address and port: `<YOUR_N8N_IP>:<YOUR_N8N_PORT>`
- Host system: Linux-based (Ubuntu)
- Default port for MCP Streamable HTTP servers: `<YOUR_MCP_PORT>`
- DNS resolution: Using IP addresses is preferred over hostnames
- Container storage: Persistent data should be mounted to host volumes

## My Preferences

- Please use `docker compose` (not `docker-compose`) in all commands and documentation
- Do NOT include a `version` field at the beginning of Docker Compose files
- Place each code file in a separate artifact (`Dockerfile`, `start.sh`, `docker-compose.yml`, `.env`, `README.md`)
- Use `node:22-slim` / `node:22-alpine` for Node.js servers and `python:3.12-slim` (or newer) for Python servers
- Store all environment variables in `.env` files that are separate from other configuration files
- Ensure `docker-compose.yml` references variables from `.env` files rather than hardcoding them

## Notes on n8n MCP Client Configuration

In n8n, configure the **MCP Client Tool** (`@n8n/n8n-nodes-langchain.mcpClientTool`, `typeVersion: 1.2`) with:
- **Server Transport**: `HTTP Streamable` (`httpStreamable`)
- **Endpoint URL**: `http://<YOUR_HOST_IP>:<YOUR_PORT>/mcp`
