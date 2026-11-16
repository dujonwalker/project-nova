# ONLYOFFICE DocSpace MCP Server (Streamable HTTP)

Uses the official pre-built [`onlyoffice/docspace-mcp:latest`](https://github.com/ONLYOFFICE/docspace-mcp) image with native `DOCSPACE_TRANSPORT=streamable-http`.

## Endpoint
- **MCP Endpoint**: `http://<HOST_IP>:3001/mcp`
- Zero third-party proxy gateways (100% native / official MCP SDK)

## Deployment
```bash
docker compose up -d
```
