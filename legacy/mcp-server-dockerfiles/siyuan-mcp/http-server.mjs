#!/usr/bin/env node
import http from 'node:http';
import { randomUUID } from 'node:crypto';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createServer } from 'siyuan-mcp';

const PORT = parseInt(process.env.MCP_PORT || process.env.SSE_PORT || '3003', 10);
const HOST = process.env.SSE_HOST || process.env.MCP_HOST || '0.0.0.0';

const sessions = new Map();

const httpServer = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

  if (req.method === 'GET' && (url.pathname === '/health' || url.pathname === '/healthz')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', server: 'siyuan-mcp' }));
    return;
  }

  if (url.pathname === '/mcp' || url.pathname.startsWith('/mcp/')) {
    try {
      const sessionId = req.headers['mcp-session-id'];
      if (sessionId && sessions.has(sessionId)) {
        const session = sessions.get(sessionId);
        await session.transport.handleRequest(req, res);
        return;
      }

      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (sid) => {
          sessions.set(sid, { transport, server });
        },
      });

      const server = createServer();
      transport.onclose = () => {
        if (transport.sessionId) {
          sessions.delete(transport.sessionId);
        }
      };

      await server.connect(transport);
      await transport.handleRequest(req, res);
    } catch (err) {
      console.error('Error handling /mcp request:', err);
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
      }
    }
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found. Use /mcp for Streamable HTTP.' }));
});

httpServer.listen(PORT, HOST, () => {
  console.log(`SiYuan MCP Server (xgq18237/siyuan_mcp_server) listening on http://${HOST}:${PORT}/mcp`);
});
