#!/usr/bin/env node

import http from 'node:http';
import { randomUUID } from 'node:crypto';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const BLINKO_DOMAIN = process.env.BLINKO_DOMAIN || 'localhost:1111';
const BLINKO_API_KEY = process.env.BLINKO_API_KEY || '';
const BLINKO_BASE_URL = BLINKO_DOMAIN.startsWith('http')
  ? BLINKO_DOMAIN.replace(/\/+$/, '')
  : `https://${BLINKO_DOMAIN}`;
const PORT = parseInt(process.env.MCP_PORT || process.env.SSE_PORT || '8442', 10);
const HOST = process.env.MCP_HOST || '0.0.0.0';

// Allow self-signed certificates for self-hosted Blinko instances
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const TOOLS = [
  {
    name: 'search_blinko_notes',
    description: 'Search for notes in Blinko',
    inputSchema: {
      type: 'object',
      properties: {
        searchText: { type: 'string', description: 'Search keyword (required)' },
        size: { type: 'number', description: 'Number of results to return', default: 10 },
        type: { type: 'number', description: 'Note type: -1 for all, 0 for flash notes, 1 for normal notes', default: -1 },
      },
      required: ['searchText'],
    },
  },
  {
    name: 'upsert_blinko_flash_note',
    description: 'Write flash note (type 0) to Blinko',
    inputSchema: {
      type: 'object',
      properties: {
        content: { type: 'string', description: 'Note content' },
      },
      required: ['content'],
    },
  },
  {
    name: 'upsert_blinko_note',
    description: 'Write note (type 1) to Blinko',
    inputSchema: {
      type: 'object',
      properties: {
        content: { type: 'string', description: 'Note content' },
      },
      required: ['content'],
    },
  },
  {
    name: 'share_blinko_note',
    description: 'Share a note or cancel sharing',
    inputSchema: {
      type: 'object',
      properties: {
        noteId: { type: 'number', description: 'ID of the note to share' },
        password: { type: 'string', description: 'Six-digit password for sharing (optional)' },
        isCancel: { type: 'boolean', description: 'Whether to cancel sharing (default: false)', default: false },
      },
      required: ['noteId'],
    },
  },
  {
    name: 'review_blinko_daily_notes',
    description: "Get today's notes for review",
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'clear_blinko_recycle_bin',
    description: 'Clear the recycle bin in Blinko',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];

async function searchNotes(args) {
  const { searchText, size = 10, type = -1 } = args || {};
  if (!searchText) throw new Error('searchText is required');

  const response = await fetch(`${BLINKO_BASE_URL}/api/v1/note/list`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${BLINKO_API_KEY}`,
    },
    body: JSON.stringify({ searchText, page: 1, size, type }),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const notes = await response.json();
  if (!Array.isArray(notes)) {
    throw new Error('Invalid response format from Blinko API');
  }

  return notes.length > 0
    ? `Found ${notes.length} note(s):\n\n${notes
        .map((note) => `**Note ID ${note.id}** (${note.type === 0 ? 'Flash' : 'Regular'}):\n${note.content}\n---`)
        .join('\n')}`
    : `Found 0 note(s) matching "${searchText}"`;
}

async function upsertNote(args, noteType) {
  const { content } = args || {};
  if (!content) throw new Error('content is required');

  const response = await fetch(`${BLINKO_BASE_URL}/api/v1/note/upsert`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${BLINKO_API_KEY}`,
    },
    body: JSON.stringify({ content, type: noteType }),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  return `Successfully created ${noteType === 0 ? 'flash' : 'regular'} note with ID: ${result.id || 'unknown'}`;
}

async function shareNote(args) {
  const { noteId, password, isCancel = false } = args || {};
  if (!noteId) throw new Error('noteId is required');

  const endpoint = isCancel
    ? `${BLINKO_BASE_URL}/api/v1/note/share/cancel`
    : `${BLINKO_BASE_URL}/api/v1/note/share`;

  const body = isCancel ? { noteId } : { noteId, ...(password && { password }) };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${BLINKO_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  return isCancel
    ? `Successfully cancelled sharing for note ID ${noteId}`
    : `Successfully shared note ID ${noteId}${password ? ` with password: ${password}` : ''}${
        result.shareLink ? `\nShare link: ${result.shareLink}` : ''
      }`;
}

async function getDailyNotes() {
  const today = new Date().toISOString().split('T')[0];

  const response = await fetch(`${BLINKO_BASE_URL}/api/v1/note/list`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${BLINKO_API_KEY}`,
    },
    body: JSON.stringify({ searchText: '', page: 1, size: 20, type: -1 }),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const notes = await response.json();
  if (!Array.isArray(notes)) {
    throw new Error('Invalid response format from Blinko API');
  }

  const todayNotes = notes.filter((note) => note.createdAt && note.createdAt.startsWith(today));
  return todayNotes.length > 0
    ? `Found ${todayNotes.length} note(s) from today:\n\n${todayNotes
        .map((note) => `**Note ID ${note.id}** (${note.type === 0 ? 'Flash' : 'Regular'}):\n${note.content}\n---`)
        .join('\n')}`
    : 'No notes found for today';
}

async function clearRecycleBin() {
  const response = await fetch(`${BLINKO_BASE_URL}/api/v1/note/recycle/clear`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${BLINKO_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return 'Successfully cleared the recycle bin';
}

function createBlinkoServer() {
  const server = new Server(
    { name: 'custom-blinko-mcp-server', version: '2.0.0' },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOLS,
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
      let result;
      switch (name) {
        case 'search_blinko_notes':
          result = await searchNotes(args);
          break;
        case 'upsert_blinko_flash_note':
          result = await upsertNote(args, 0);
          break;
        case 'upsert_blinko_note':
          result = await upsertNote(args, 1);
          break;
        case 'share_blinko_note':
          result = await shareNote(args);
          break;
        case 'review_blinko_daily_notes':
          result = await getDailyNotes();
          break;
        case 'clear_blinko_recycle_bin':
          result = await clearRecycleBin();
          break;
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
      return { content: [{ type: 'text', text: result }] };
    } catch (error) {
      return {
        content: [{ type: 'text', text: `Error: ${error.message}` }],
        isError: true,
      };
    }
  });

  return server;
}

const sessions = new Map();

const httpServer = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

  if (req.method === 'GET' && (url.pathname === '/health' || url.pathname === '/healthz')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', server: 'custom-blinko-mcp-server' }));
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

      const server = createBlinkoServer();
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
  console.log(`Custom Blinko MCP Server (Streamable HTTP) listening on http://${HOST}:${PORT}/mcp`);
});
