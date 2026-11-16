#!/usr/bin/env python3
import os
import sys
import uvicorn
from starlette.responses import JSONResponse
from mcp.server.streamable_http_manager import StreamableHTTPSessionManager

simple_mode = os.environ.get("FLOWISE_SIMPLE_MODE", "false").lower() in ("true", "1", "yes")
if simple_mode:
    from mcp_flowise.server_fastmcp import mcp
    lowlevel_server = mcp._mcp_server
else:
    from mcp_flowise.server_lowlevel import mcp as lowlevel_server

session_manager = StreamableHTTPSessionManager(
    app=lowlevel_server,
    stateless=True,
)


class MCPStreamableHTTPApp:
    def __init__(self, manager: StreamableHTTPSessionManager):
        self.manager = manager

    async def __call__(self, scope, receive, send):
        if scope["type"] == "lifespan":
            async with self.manager.run():
                while True:
                    message = await receive()
                    if message["type"] == "lifespan.startup":
                        await send({"type": "lifespan.startup.complete"})
                    elif message["type"] == "lifespan.shutdown":
                        await send({"type": "lifespan.shutdown.complete"})
                        return
            return

        if scope["type"] == "http":
            path = scope.get("path", "")
            if path in ("/health", "/healthz"):
                response = JSONResponse({"status": "ok"})
                await response(scope, receive, send)
                return
            if path == "/mcp" or path.startswith("/mcp/"):
                await self.manager.handle_request(scope, receive, send)
                return
            response = JSONResponse(
                {"error": "Not found. Use /mcp for Streamable HTTP."},
                status_code=404,
            )
            await response(scope, receive, send)


app = MCPStreamableHTTPApp(session_manager)

if __name__ == "__main__":
    host = os.environ.get("MCP_HOST") or os.environ.get("SSE_HOST") or "0.0.0.0"
    port_str = (
        os.environ.get("MCP_PORT")
        or os.environ.get("SSE_PORT")
        or os.environ.get("MCP_SSE_PORT")
        or "3011"
    )
    port = int(port_str)
    print(f"Starting MCP Streamable HTTP Server on http://{host}:{port}/mcp", flush=True)
    uvicorn.run(app, host=host, port=port, log_level="info")
