# Langfuse MCP Server (`langfuse-mcp`)

Uses the official pre-built [`ghcr.io/avivsinai/langfuse-mcp:0.14.0`](https://github.com/avivsinai/langfuse-mcp) image running native **Streamable HTTP** (`LANGFUSE_MCP_TRANSPORT=streamable-http`) at `/mcp`, targeting self-hosted Langfuse v4 (`http://127.0.0.1:3000`).

## Endpoints
- **MCP Endpoint**: `http://127.0.0.1:3006/mcp`
- **Target Langfuse Instance**: `http://127.0.0.1:3000` (`langfuse`)

## Required Compose environment variables
Configure in the Compose deployments `environment` block (referencing existing environment variables):
```env
LANGFUSE_PUBLIC_KEY=[[LANGFUSE_PUBLIC_KEY]]
LANGFUSE_SECRET_KEY=[[LANGFUSE_SECRET_KEY]]
```
