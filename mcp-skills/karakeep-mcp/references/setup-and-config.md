# `karakeep-mcp` Setup & Configuration

Upstream `@karakeep/mcp` runs over `stdio`. Pass credentials via environment variables:

- `KARAKEEP_API_ADDR`: Base URL of your Karakeep server (e.g., `https://karakeep.example.com`; the client appends `/api/v1`)
- `KARAKEEP_API_KEY`: Karakeep API key (sent as `Authorization: Bearer <key>`)
- `KARAKEEP_CUSTOM_HEADERS`: Optional JSON object of extra headers (e.g., Cloudflare Access `CF-Access-Client-Id` / `CF-Access-Client-Secret`)

## NPM (`npx`)

```json
{
  "mcpServers": {
    "karakeep": {
      "command": "npx",
      "args": ["@karakeep/mcp"],
      "env": {
        "KARAKEEP_API_ADDR": "https://<YOUR_SERVER_ADDR>",
        "KARAKEEP_API_KEY": "<YOUR_TOKEN>"
      }
    }
  }
}
```

## Docker (`stdio`)

```json
{
  "mcpServers": {
    "karakeep": {
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "-e", "KARAKEEP_API_ADDR=https://<YOUR_SERVER_ADDR>",
        "-e", "KARAKEEP_API_KEY=<YOUR_TOKEN>",
        "ghcr.io/karakeep-app/karakeep-mcp:latest"
      ]
    }
  }
}
```
