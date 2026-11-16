#!/usr/bin/env node

import http from 'node:http';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const SERVER_VERSION = '2.1.0';
const RAW_BLINKO_URL =
  process.env.BLINKO_URL ||
  process.env.BLINKO_HOST ||
  process.env.BLINKO_DOMAIN ||
  'https://127.0.0.1:8443';
const BLINKO_BASE_URL = (
  RAW_BLINKO_URL.startsWith('http://') || RAW_BLINKO_URL.startsWith('https://')
    ? RAW_BLINKO_URL
    : `https://${RAW_BLINKO_URL}`
)
  .replace(/\/+$/, '')
  .replace(/\/api$/, '');
const BLINKO_TOKEN = process.env.BLINKO_TOKEN || process.env.BLINKO_API_KEY || '';
const PORT = parseInt(process.env.MCP_PORT || process.env.SSE_PORT || '8442', 10);
const HOST = process.env.MCP_HOST || '0.0.0.0';

if (!BLINKO_TOKEN) {
  console.error('Error: BLINKO_TOKEN (or BLINKO_API_KEY) environment variable is required');
  process.exit(1);
}

const NOTE_TYPE_LABELS = {
  0: 'Flash',
  1: 'Regular',
  2: 'Todo',
};

function formatNoteType(type) {
  return NOTE_TYPE_LABELS[type] ?? `Type ${type}`;
}

const TOOLS = [
  {
    name: 'search_blinko_notes',
    description: 'Search and filter notes, flash notes, and todos in Blinko',
    inputSchema: {
      type: 'object',
      properties: {
        searchText: { type: 'string', description: 'Search keyword (optional when using filters)', default: '' },
        page: { type: 'number', description: 'Page number (1-indexed)', default: 1 },
        size: { type: 'number', description: 'Number of results to return', default: 10 },
        type: { type: 'number', description: 'Note type: -1 for all, 0 for flash, 1 for regular, 2 for todo', default: -1 },
        orderBy: { type: 'string', enum: ['asc', 'desc'], description: 'Sort order by date', default: 'desc' },
        isArchived: { type: 'boolean', description: 'Search in archived notes (default: false)', default: false },
        isRecycle: { type: 'boolean', description: 'Search in recycled notes (default: false)', default: false },
        isUseAiQuery: { type: 'boolean', description: 'Use AI semantic search if configured in Blinko (default: false)', default: false },
        startDate: { type: 'string', description: 'Start date filter in ISO 8601 format' },
        endDate: { type: 'string', description: 'End date filter in ISO 8601 format' },
        hasTodo: { type: 'boolean', description: 'Only include notes containing todos (default: false)', default: false },
      },
    },
  },
  {
    name: 'get_blinko_note',
    description: 'Get full details of a Blinko note by ID',
    inputSchema: {
      type: 'object',
      properties: {
        noteId: { type: 'number', description: 'ID of the note to retrieve' },
      },
      required: ['noteId'],
    },
  },
  {
    name: 'upsert_blinko_flash_note',
    description: 'Create or update a flash note (type 0) in Blinko',
    inputSchema: {
      type: 'object',
      properties: {
        content: { type: 'string', description: 'Note content' },
        noteId: { type: 'number', description: 'Optional existing note ID to update' },
      },
      required: ['content'],
    },
  },
  {
    name: 'upsert_blinko_note',
    description: 'Create or update a regular note (type 1) in Blinko',
    inputSchema: {
      type: 'object',
      properties: {
        content: { type: 'string', description: 'Note content' },
        noteId: { type: 'number', description: 'Optional existing note ID to update' },
      },
      required: ['content'],
    },
  },
  {
    name: 'upsert_blinko_todo',
    description: 'Create or update a todo (type 2) in Blinko',
    inputSchema: {
      type: 'object',
      properties: {
        content: { type: 'string', description: 'Todo content' },
        noteId: { type: 'number', description: 'Optional existing todo ID to update' },
      },
      required: ['content'],
    },
  },
  {
    name: 'trash_blinko_note',
    description: 'Move one or more Blinko notes to the recycle bin (soft delete)',
    inputSchema: {
      type: 'object',
      properties: {
        noteId: { type: 'number', description: 'ID of the note to move to recycle bin' },
      },
      required: ['noteId'],
    },
  },
  {
    name: 'share_blinko_note',
    description: 'Share a note or cancel sharing',
    inputSchema: {
      type: 'object',
      properties: {
        noteId: { type: 'number', description: 'ID of the note to share' },
        password: { type: 'string', description: 'Password for sharing (optional)' },
        isCancel: { type: 'boolean', description: 'Whether to cancel sharing (default: false)', default: false },
      },
      required: ['noteId'],
    },
  },
  {
    name: 'review_blinko_daily_notes',
    description: "Get Blinko daily review notes and/or notes created on a given date",
    inputSchema: {
      type: 'object',
      properties: {
        date: { type: 'string', description: 'Optional YYYY-MM-DD date filter for notes created on that date (UTC)' },
      },
    },
  },
  {
    name: 'clear_blinko_recycle_bin',
    description: 'Permanently clear the recycle bin in Blinko',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];

async function blinkoRequest(path, { method = 'POST', body } = {}) {
  const response = await fetch(`${BLINKO_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${BLINKO_TOKEN}`,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`API request failed: ${response.status} ${response.statusText}${errText ? ` - ${errText}` : ''}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

function formatNotesList(notes, header) {
  if (notes.length === 0) return header;
  return `${header}:\n\n${notes
    .map((note) => `**Note ID ${note.id}** (${formatNoteType(note.type)}):\n${note.content}\n---`)
    .join('\n')}`;
}

async function searchNotes(args) {
  const {
    searchText = '',
    page = 1,
    size = 10,
    type = -1,
    orderBy = 'desc',
    isArchived = false,
    isRecycle = false,
    isUseAiQuery = false,
    startDate = null,
    endDate = null,
    hasTodo = false,
  } = args || {};

  const notes = await blinkoRequest('/api/v1/note/list', {
    body: {
      searchText,
      page,
      size,
      type,
      orderBy,
      isArchived,
      isRecycle,
      isUseAiQuery,
      startDate,
      endDate,
      hasTodo,
    },
  });
  if (!Array.isArray(notes)) {
    throw new Error('Invalid response format from Blinko API');
  }

  return notes.length > 0
    ? formatNotesList(notes, `Found ${notes.length} note(s)`)
    : `Found 0 note(s)${searchText ? ` matching "${searchText}"` : ''}`;
}

async function getNote(args) {
  const { noteId } = args || {};
  if (noteId === undefined || noteId === null) throw new Error('noteId is required');

  const note = await blinkoRequest('/api/v1/note/detail', { body: { id: noteId } });
  if (!note) return `Note ID ${noteId} not found`;
  return `**Note ID ${note.id}** (${formatNoteType(note.type)}, created ${note.createdAt}):\n${note.content}`;
}

async function upsertNote(args, noteType) {
  const { content, noteId } = args || {};
  if (!content) throw new Error('content is required');

  const payload = { content, type: noteType };
  if (noteId !== undefined && noteId !== null) {
    payload.id = noteId;
  }

  const result = await blinkoRequest('/api/v1/note/upsert', { body: payload });
  const action = noteId !== undefined && noteId !== null ? 'updated' : 'created';
  return `Successfully ${action} ${formatNoteType(noteType).toLowerCase()} note with ID: ${result?.id ?? noteId ?? 'unknown'}`;
}

async function trashNote(args) {
  const { noteId } = args || {};
  if (noteId === undefined || noteId === null) throw new Error('noteId is required');

  await blinkoRequest('/api/v1/note/batch-trash', { body: { ids: [noteId] } });
  return `Successfully moved note ID ${noteId} to recycle bin`;
}

async function shareNote(args) {
  const { noteId, password, isCancel = false } = args || {};
  if (noteId === undefined || noteId === null) throw new Error('noteId is required');

  const body = isCancel
    ? { id: noteId, isCancel: true }
    : { id: noteId, isCancel: false, ...(password ? { password } : {}) };

  const result = await blinkoRequest('/api/v1/note/share', { body });
  if (isCancel) {
    return `Successfully cancelled sharing for note ID ${noteId}`;
  }
  const shareUrl = result?.shareEncryptedUrl
    ? `${BLINKO_BASE_URL}/share/${result.shareEncryptedUrl}`
    : result?.shareLink;
  return `Successfully shared note ID ${noteId}${password ? ` with password: ${password}` : ''}${
    shareUrl ? `\nShare link: ${shareUrl}` : ''
  }`;
}

async function getDailyNotes(args) {
  const targetDate = args?.date || new Date().toISOString().split('T')[0];

  if (args?.date) {
    const notes = await blinkoRequest('/api/v1/note/list', {
      body: { searchText: '', page: 1, size: 50, type: -1 },
    });
    if (!Array.isArray(notes)) {
      throw new Error('Invalid response format from Blinko API');
    }
    const matchingNotes = notes.filter((note) => note.createdAt && note.createdAt.startsWith(targetDate));
    return matchingNotes.length > 0
      ? formatNotesList(matchingNotes, `Found ${matchingNotes.length} note(s) from ${targetDate}`)
      : `No notes found for ${targetDate}`;
  }

  const [reviewNotes, recentNotes] = await Promise.all([
    blinkoRequest('/api/v1/note/daily-review-list', { method: 'GET' }),
    blinkoRequest('/api/v1/note/list', { body: { searchText: '', page: 1, size: 50, type: -1 } }),
  ]);

  const sections = [];
  if (Array.isArray(reviewNotes) && reviewNotes.length > 0) {
    sections.push(formatNotesList(reviewNotes, `Daily review queue (${reviewNotes.length})`));
  }
  if (Array.isArray(recentNotes)) {
    const todayNotes = recentNotes.filter((note) => note.createdAt && note.createdAt.startsWith(targetDate));
    if (todayNotes.length > 0) {
      sections.push(formatNotesList(todayNotes, `Created today (${targetDate})`));
    }
  }

  return sections.length > 0 ? sections.join('\n\n') : `No daily review notes or notes created on ${targetDate}`;
}

async function clearRecycleBin() {
  await blinkoRequest('/api/v1/note/clear-recycle-bin', { body: {} });
  return 'Successfully cleared the recycle bin';
}

const TOOL_HANDLERS = {
  search_blinko_notes: searchNotes,
  get_blinko_note: getNote,
  upsert_blinko_flash_note: (args) => upsertNote(args, 0),
  upsert_blinko_note: (args) => upsertNote(args, 1),
  upsert_blinko_todo: (args) => upsertNote(args, 2),
  trash_blinko_note: trashNote,
  share_blinko_note: shareNote,
  review_blinko_daily_notes: getDailyNotes,
  clear_blinko_recycle_bin: clearRecycleBin,
};

function createBlinkoServer() {
  const server = new Server(
    { name: 'blinko-mcp-server', version: SERVER_VERSION },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const handler = TOOL_HANDLERS[name];
    if (!handler) {
      return {
        content: [{ type: 'text', text: `Error: Unknown tool: ${name}` }],
        isError: true,
      };
    }

    try {
      const result = await handler(args);
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

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const raw = Buffer.concat(chunks).toString('utf8').trim();
  return raw ? JSON.parse(raw) : undefined;
}

function writeJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

const httpServer = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

  if (req.method === 'GET' && (url.pathname === '/health' || url.pathname === '/healthz')) {
    writeJson(res, 200, {
      status: 'ok',
      server: 'blinko-mcp-server',
      version: SERVER_VERSION,
      transport: 'http',
      stateless: true,
    });
    return;
  }

  if (url.pathname === '/mcp' || url.pathname.startsWith('/mcp/')) {
    let parsedBody;
    if (req.method === 'POST') {
      try {
        parsedBody = await readJsonBody(req);
      } catch (err) {
        writeJson(res, 400, {
          jsonrpc: '2.0',
          error: { code: -32700, message: `Invalid JSON body: ${err.message}` },
          id: null,
        });
        return;
      }
    }

    const server = createBlinkoServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });
    res.on('close', () => {
      transport.close().catch(() => undefined);
      server.close().catch(() => undefined);
    });

    try {
      await server.connect(transport);
      await transport.handleRequest(req, res, parsedBody);
    } catch (err) {
      console.error('Error handling /mcp request:', err);
      if (!res.headersSent) {
        writeJson(res, 500, {
          jsonrpc: '2.0',
          error: { code: -32603, message: err.message || 'Internal server error' },
          id: null,
        });
      }
    }
    return;
  }

  writeJson(res, 404, { error: 'Not found. Use /mcp for Streamable HTTP.' });
});

httpServer.listen(PORT, HOST, () => {
  console.log(`Blinko MCP Server v${SERVER_VERSION} listening on http://${HOST}:${PORT}/mcp (target: ${BLINKO_BASE_URL})`);
});
