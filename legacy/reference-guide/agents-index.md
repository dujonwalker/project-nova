# Project NOVA Agents Index

This index provides a comprehensive overview of all available specialized agents in Project NOVA. For detailed information about each agent, refer to the domain-specific manuals.

## Knowledge Management & Note-Taking Agents

| Agent | Description | Key Capabilities |
|-------|-------------|-----------------|
| [TriliumNext Notes Agent](https://github.com/perfectra1n/triliumnext-mcp) | Controls TriliumNext Notes knowledge base application | Search, create, update, and delete hierarchical notes |
| [Blinko Agent](../../mcp-server-dockerfiles/custom-blinko-mcp) | Manages notes in the Blinko note-taking service (custom MCP implementation) | Create flash notes, regular notes, share notes |
| [BookStack Agent](https://github.com/ttpears/bookstack-mcp) | Interfaces with BookStack documentation and wiki platform | Search and retrieve content from wiki pages |
| [Memos Agent](https://github.com/andreroggeri/memo-mcp) | Works with lightweight Memos note-taking application | Search and create memos with visibility control |
| [Outline Agent](https://github.com/Vortiago/mcp-outline) | Manages Outline knowledge base for team documentation | Document management, collection organization, comments |
| [SiYuan Agent](https://github.com/xgq18237/siyuan_mcp_server) | Controls SiYuan Note personal knowledge management system | Command execution, notebooks, documents, blocks, SQL queries |
| [Karakeep Agent](https://docs.karakeep.app/mcp/) | Organizes digital content collections and bookmarks | Bookmark search, list management, tag management |
| [Paperless Agent](https://github.com/retiform-labs/paperless-mcp) | Manages Paperless-NGX document management system | Document operations, tags, correspondents, document types |
| [OnlyOffice Agent](https://github.com/ONLYOFFICE/docspace-mcp) | Manages ONLYOFFICE DocSpace for document collaboration | File/folder management, room management, batch operations |

## Development & Repository Management Agents

| Agent | Description | Key Capabilities |
|-------|-------------|-----------------|
| [CLI Server Agent](https://github.com/MladenSU/cli-mcp-server) | Provides secure command-line execution capabilities | Execute whitelisted commands, show security rules |
| [Forgejo Agent](https://git.b4mad.industries/agentic-forges/forgejo-mcp) | Manages Forgejo Git repositories and issues | Repository, branch, file, issue, and PR management |
| [Gitea Agent](https://gitea.com/gitea/gitea-mcp) | Controls Gitea Git service for repository management | User, repo, branch, tag, file, issue operations |
| [System Search Agent](https://github.com/mamertofabian/mcp-everything-search) | Finds files and folders across Linux file systems | Pattern-based file search with various filters |

## Media & Creative Tools Agents

| Agent | Description | Key Capabilities |
|-------|-------------|-----------------|
| [Ableton Copilot](https://github.com/xiaolaa2/ableton-copilot-mcp) | Assists with music production in Ableton Live | Music production assistance and guidance |
| [OBS Agent](https://github.com/dearlordylord/obs-mcp) | Controls OBS Studio for streaming and recording | Scene, source, streaming, recording management |
| [Reaper Agent](https://github.com/xDarkzx/Reaper-MCP) | Controls REAPER digital audio workstation | Project creation, tracks, MIDI note input |
| [Reaper QA Agent](https://github.com/dschuler36/reaper-mcp-server) | Analyzes and answers questions about REAPER projects | Project discovery and detailed analysis |
| [YouTube Agent](https://github.com/kimtaeyoon83/mcp-server-youtube-transcript) | Transcribes YouTube videos for summarization and content analysis | Video transcript extraction with optional timestamps |

## AI & Automation Agents

| Agent | Description | Key Capabilities |
|-------|-------------|-----------------|
| [Flowise Agent](https://github.com/matthewhand/mcp-flowise) | Connects to Flowise chatflows and AI assistants | Access custom AI workflows, list and execute chatflows |
| [Langfuse Agent](https://github.com/avivsinai/langfuse-mcp) | Accesses managed prompts and observability from Langfuse | List and retrieve professionally designed prompts |
| [Playwright / Browser Automation Agent](https://github.com/microsoft/playwright-mcp) | Provides browser automation for web scraping and testing | Web navigation, screenshots, element interaction |
| [RAGFlow Agent](https://github.com/xiangmy21/ragflow_mcp_server) | Retrieval-augmented generation with source citations | Document-grounded knowledge retrieval |
| [Fetch Agent](https://github.com/zcaceres/fetch-mcp) | Retrieves web content from URLs with advanced options | HTML, JSON, text, and Markdown web content retrieval |

## Monitoring & Home Automation Agents

| Agent | Description | Key Capabilities |
|-------|-------------|-----------------|
| [Home Assistant Agent](https://github.com/homeassistant-ai/ha-mcp) | Controls smart home devices through Home Assistant | Entity control, automation, troubleshooting |
| [Prometheus Agent](https://github.com/pab1it0/prometheus-mcp-server) | Queries and analyzes metrics from Prometheus monitoring systems | PromQL queries, metrics discovery, target info |

## Quick Reference Guide

### Common Agent Patterns

1. **Search & Retrieval**
   - Most knowledge agents support search with keywords
   - Repository agents allow searching by file names, content, or metadata
   - System Search Agent provides file system-wide search capabilities

2. **Creation & Management**
   - Note-taking agents allow creating, updating, and organizing notes
   - Repository agents support creating repos, branches, files, issues
   - Media tools enable project creation and asset management

3. **Control & Automation**
   - Home Assistant allows controlling smart devices
   - OBS controls streaming and recording
   - Puppeteer enables web automation

4. **Analysis & Insight**
   - Prometheus provides system metrics analysis
   - RAGFlow enables document-grounded question answering
   - Reaper QA analyzes music production projects

### Combinations for Advanced Workflows

- **Content Research & Note-Taking**: Use Fetch Agent to retrieve web content, then create notes with TriliumNext or Outline
- **Development Documentation**: Use Gitea Agent with BookStack or Outline to maintain code and documentation in sync
- **Media Content Creation**: Combine YouTube transcription with OBS recording and Reaper production
- **Smart Home Monitoring**: Use Home Assistant with Prometheus to monitor and control home environment

### Troubleshooting Quick Reference

1. For permission or access issues: Check credentials and configured paths
2. For search with no results: Try broader terms or different search parameters
3. For creation failures: Verify all required parameters are provided
4. For control operations: Ensure the target exists and is accessible
5. For complex workflows: Break down into multiple simpler steps
