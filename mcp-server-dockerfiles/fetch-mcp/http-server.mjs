#!/usr/bin/env node
import http from 'node:http';
import { randomUUID } from 'node:crypto';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import {
  CallToolRequestSchema,
  GetPromptRequestSchema,
  ListPromptsRequestSchema,
  ListResourcesRequestSchema,
  ListResourceTemplatesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const PORT = parseInt(process.env.MCP_PORT || process.env.SSE_PORT || '3000', 10);
const HOST = process.env.MCP_HOST || '0.0.0.0';
const [command, ...args] = process.argv.slice(2);

if (!command) {
  console.error('Usage: node http-server.mjs <command> [args...]');
  process.exit(1);
}

const stdioTransport = new StdioClientTransport({
  command,
  args,
  env: { ...process.env },
});

const upstreamClient = new Client(
  { name: 'mcp-streamable-http-host', version: '1.0.0' },
  { capabilities: {} }
);

await upstreamClient.connect(stdioTransport);
const upstreamCapabilities = upstreamClient.getServerCapabilities() || { tools: {} };
const upstreamInfo = upstreamClient.getServerVersion() || { name: 'mcp-server', version: '1.0.0' };
console.log(`Connected to upstream stdio MCP server: ${upstreamInfo.name} v${upstreamInfo.version}`);

function createProxyServer() {
  const server = new Server(upstreamInfo, { capabilities: upstreamCapabilities });

  server.setRequestHandler(ListToolsRequestSchema, async (req) => {
    return await upstreamClient.listTools(req.params);
  });

  server.setRequestHandler(CallToolRequestSchema, async (req) => {
    return await upstreamClient.callTool(req.params);
  });

  if (upstreamCapabilities.resources) {
    server.setRequestHandler(ListResourcesRequestSchema, async (req) => {
      return await upstreamClient.listResources(req.params);
    });
    server.setRequestHandler(ListResourceTemplatesRequestSchema, async (req) => {
      return await upstreamClient.listResourceTemplates(req.params);
    });
    server.setRequestHandler(ReadResourceRequestSchema, async (req) => {
      return await upstreamClient.readResource(req.params);
    });
  }

  if (upstreamCapabilities.prompts) {
    server.setRequestHandler(ListPromptsRequestSchema, async (req) => {
      return await upstreamClient.listPrompts(req.params);
    });
    server.setRequestHandler(GetPromptRequestSchema, async (req) => {
      return await upstreamClient.getPrompt(req.params);
    });
  }

  return server;
}

const sessions = new Map();

const httpServer = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

  if (req.method === 'GET' && (url.pathname === '/health' || url.pathname === '/healthz')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', server: upstreamInfo }));
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

      const server = createProxyServer();
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
  console.log(`MCP Streamable HTTP Server listening on http://${HOST}:${PORT}/mcp`);
});
