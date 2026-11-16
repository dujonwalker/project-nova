# `bookstack-mcp` Setup & Configuration

## 1. BookStack API Token Permissions

In BookStack, open your profile's **API Tokens** section and create a token for a dedicated account (separate **Token ID** and **Token Secret**):
- **Required**: Role with **Access System API** + view permissions for target books/pages.
- **Recommended**: **Export Content** permission so `bookstack-mcp` can read WYSIWYG pages as Markdown via BookStack's export endpoint.
- **Admin-only tools**: `find_users`, `get_recycle_bin`, `restore_deleted`, and `permanently_delete` require administrative permissions.

## 2. Client Configuration (`stdio`)

Recommended Node.js: Node 24 LTS (or Node 22). The server does not auto-read `.env`—pass environment variables via your client's `env` block.

```json
{
  "mcpServers": {
    "bookstack": {
      "command": "npx",
      "args": ["-y", "bookstack-mcp@5.7.1"],
      "env": {
        "BOOKSTACK_BASE_URL": "https://wiki.example.com",
        "BOOKSTACK_TOKEN_ID": "your-token-id",
        "BOOKSTACK_TOKEN_SECRET": "your-token-secret"
      }
    }
  }
}
```

## 3. Common Optional Settings

| Environment Variable | Purpose |
| :--- | :--- |
| `BOOKSTACK_ENABLE_WRITE=true` | Expose the 22 write tools (non-OAuth mode; read-only by default) |
| `BOOKSTACK_IMAGE_ALLOWED_HOSTS` | Comma-separated hostnames allowed for `create_image` HTTP `url` sources (including redirects) |

For Docker/HTTP deployments and Microsoft Entra OAuth setup, see the upstream `docs/SETUP.md` and `docs/CONFIGURATION.md`.
