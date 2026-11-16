# `nextcloud-mcp` Setup & Configuration

Upstream repository: [`cbcoutinho/nextcloud-mcp-server`](https://github.com/cbcoutinho/nextcloud-mcp-server) (`v0.212.0`, AGPL-3.0-only, Python `>=3.11`).

## Transports & Endpoints

- Default transport: **`streamable-http`** (`--transport streamable-http`, default host `127.0.0.1`, port `8000`), serving `/mcp`, `/health/live`, and `/health/ready`.
- Local `stdio` transport: `--transport stdio`.
- App filtering: `--enable-app <app>` (repeatable across `notes`, `tables`, `webdav`, `sharing`, `calendar`, `collectives`, `contacts`, `cookbook`, `deck`, `news`, `mail`, `talk`, `shopping_list`).

## Authentication Modes (`MCP_DEPLOYMENT_MODE`)

| Mode | Configuration | How Clients Authenticate |
| :--- | :--- | :--- |
| `single_user_basic` | `NEXTCLOUD_HOST`, `NEXTCLOUD_USERNAME`, `NEXTCLOUD_PASSWORD` (app password) | Server uses configured credentials |
| `multi_user_basic` | `NEXTCLOUD_HOST` (do not set `NEXTCLOUD_USERNAME`/`PASSWORD`) | Client passes `Authorization: Basic <base64(user:app_password)>` header per request |
| `login_flow` | `NEXTCLOUD_HOST`, `TOKEN_ENCRYPTION_KEY`, `TOKEN_STORAGE_DB` or `DATABASE_URL`, `NEXTCLOUD_OIDC_CLIENT_ID`/`SECRET`, `NEXTCLOUD_MCP_SERVER_URL`, `NEXTCLOUD_PUBLIC_ISSUER_URL` | OAuth Login Flow v2; server stores encrypted per-user app passwords |

## Key Optional Environment Variables

- `NEXTCLOUD_VERIFY_SSL`: Set `false` for self-signed Nextcloud TLS certificates.
- `EXCLUDED_TAGS`: Nextcloud system tag(s) hiding tagged files/folders from WebDAV tools.
- `ENABLE_SEMANTIC_SEARCH`: Enable experimental vector search (`true`/`false`; requires Qdrant + embedding backend and `[semantic]` extra).
- `ENABLE_UNSTRUCTURED` / `UNSTRUCTURED_API_URL`: Optional external document parser for formats beyond built-in PDF text extraction and Tesseract OCR.
