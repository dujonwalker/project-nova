# Project NOVA

Project NOVA is a DIY, agent-agnostic toolkit of self-hosted
[Model Context Protocol (MCP)](https://modelcontextprotocol.io/) servers.
Each server exposes one focused capability over Streamable HTTP so it can be
used by the client, harness, or automation runtime that fits your workflow.

NOVA is **not** a standalone assistant, chat application, central router, or
required orchestration runtime. Use the servers with Hermes-Agent, llama.cpp
WebUI, n8n, or any MCP client.

Optional client-facing skill bundles are indexed in
[`mcp-skills/README.md`](mcp-skills/README.md).

## What changed in v2

- **25-server MCP catalog:** The repository provides 25 focused MCP servers.
- **Streamable HTTP baseline:** Servers use Streamable HTTP at `/mcp` where
  supported; each server README documents service-specific transport and
  deployment caveats.
- **Current implementations:** Each server directory contains its deployment
  files, source or image configuration, and service-specific documentation.
- **Repository-local skills added:** v2 adds 25 optional skill bundles, one for
  each included MCP server. Use them directly from this repository or copy
  selected bundles into a client-supported local skills directory.
- **Agent-agnostic usage:** Servers and skills work with compatible clients,
  harnesses, or direct MCP connections.

## What is included

Every active server lives in its own directory under
[`mcp-server-dockerfiles/`](mcp-server-dockerfiles/). Server READMEs contain
the service-specific requirements, environment variables, and startup
instructions. The current transport baseline is Streamable HTTP at `/mcp`;
consult each server README for its supported transport and endpoint details.

### Included server catalog

| Capability | Directory | Focus |
| --- | --- | --- |
| BookStack | [`bookstack-mcp`](mcp-server-dockerfiles/bookstack-mcp/) | Documentation and wiki content |
| Gitea | [`gitea-mcp`](mcp-server-dockerfiles/gitea-mcp/) | Git repositories, issues, and releases |
| Forgejo | [`forgejo-mcp`](mcp-server-dockerfiles/forgejo-mcp/) | Forgejo repositories and issues |
| Karakeep | [`karakeep-mcp`](mcp-server-dockerfiles/karakeep-mcp/) | Bookmarks, tags, and saved content |
| Memos | [`memos-mcp`](mcp-server-dockerfiles/memos-mcp/) | Notes and lightweight publishing |
| Paperless-NGX | [`paperless-mcp`](mcp-server-dockerfiles/paperless-mcp/) | Documents, tags, and correspondents |
| Prometheus | [`prometheus-mcp`](mcp-server-dockerfiles/prometheus-mcp/) | Metrics queries and monitoring |
| TriliumNext | [`triliumnext-mcp`](mcp-server-dockerfiles/triliumnext-mcp/) | Hierarchical notes and knowledge |
| Outline | [`outline-mcp`](mcp-server-dockerfiles/outline-mcp/) | Team knowledge-base documents |
| Home Assistant | [`home-assistant-mcp`](mcp-server-dockerfiles/home-assistant-mcp/) | Smart-home entities and automations |
| Langfuse | [`langfuse-mcp`](mcp-server-dockerfiles/langfuse-mcp/) | Prompts and observability data |
| YouTube | [`youtube-mcp`](mcp-server-dockerfiles/youtube-mcp/) | Video metadata and transcripts |
| Blinko | [`custom-blinko-mcp`](mcp-server-dockerfiles/custom-blinko-mcp/) | Notes, flash notes, and sharing |
| Fetcher | [`fetch-mcp`](mcp-server-dockerfiles/fetch-mcp/) | Web content retrieval |
| Playwright | [`playwright-mcp`](mcp-server-dockerfiles/playwright-mcp/) | Browser automation |
| Filesystem | [`filesystem-mcp`](mcp-server-dockerfiles/filesystem-mcp/) | File and directory operations |
| OBS | [`obs-mcp`](mcp-server-dockerfiles/obs-mcp/) | Scenes, sources, and recording |
| Ableton Live | [`ableton-copilot-mcp`](mcp-server-dockerfiles/ableton-copilot-mcp/) | Music production control |
| REAPER | [`reaper-mcp`](mcp-server-dockerfiles/reaper-mcp/) | Live REAPER project control |
| REAPER Project QA | [`reaper-qa-mcp`](mcp-server-dockerfiles/reaper-qa-mcp/) | Offline REAPER project analysis |
| CLI/Shell | [`cli-server-mcp`](mcp-server-dockerfiles/cli-server-mcp/) | Controlled command-line execution |
| Nextcloud | [`nextcloud-mcp`](mcp-server-dockerfiles/nextcloud-mcp/) | Files, calendars, and collaboration |
| Komodo | [`komodo-mcp`](mcp-server-dockerfiles/komodo-mcp/) | Infrastructure and deployment management |
| SearXNG | [`searxng-mcp`](mcp-server-dockerfiles/searxng-mcp/) | Federated web search |
| Vision Bridge | [`vision-bridge-mcp`](mcp-server-dockerfiles/vision-bridge-mcp/) | Image understanding and analysis |

## Quick start

1. Choose a server from the catalog and read its server-specific README.
2. Copy or create the required environment configuration for the service.
3. Start the server with its Docker Compose configuration:

   ```bash
   cd mcp-server-dockerfiles/<server-directory>
   docker compose up --build
   ```

4. Register the server's `http://<host>:<port>/mcp` endpoint in your MCP
   client or compatible harness.
5. Test the connection with a read-only operation before enabling writes or
   destructive actions.

Most servers require the application they control to be running separately.
Credentials and service URLs are intentionally configured per server rather
than through a central NOVA runtime. Copy the relevant `.env.example` to
`.env` locally; `.env` files are ignored and must never be published.

## Repository layout

```text
project-nova/
├── README.md
├── mcp-skills/                  # Optional client-facing skill bundles
│   └── <skill-name>/SKILL.md
└── mcp-server-dockerfiles/       # Active MCP server implementations
    └── <server>-mcp/
        ├── Dockerfile
        ├── docker-compose.yml
        ├── README.md
        └── startup/source files
```
