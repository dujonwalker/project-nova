# Setup and troubleshooting

Read this when the tools are missing, or when a call fails with `MISSING_API_KEY` or `API_ERROR`.

## What the user needs

- Node.js 18 or later
- A Gemini API key from https://aistudio.google.com/apikey (the project README says the free tier is about 1,500 requests/day)

## OpenCode config

In `opencode.json` (project root) or `~/.config/opencode/opencode.json` (global):

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "vision-bridge": {
      "type": "local",
      "command": ["npx", "-y", "vision-bridge-mcp"],
      "environment": {
        "GEMINI_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

Alternatively, export `GEMINI_API_KEY` in the shell profile and omit the `environment` block. Restart OpenCode, or run `opencode mcp`, after changing the config.

If `npx` cannot find `vision-bridge-mcp`, the package may be published under the scoped name from its `package.json`: `@yanu30adi/vision-bridge-mcp`.

The server speaks MCP over stdio, so the same command works in any MCP client that can launch a local stdio server. The config shape differs per client.

## Environment variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `GEMINI_API_KEY` | none (required) | Gemini API key |
| `GEMINI_MODEL` | `gemini-3.6-flash` | Any Gemini model with vision support |
| `VISION_BRIDGE_MAX_IMAGE_MB` | `20` | Reject images larger than this |

## Quirks worth knowing

- The server starts and lists its tools even with no API key. The error only appears when a tool is called, so "tools are visible" does not mean "setup is complete."
- The key check runs before path validation. With no key, every call returns `MISSING_API_KEY`, even for a bad path.
- Image type is decided by file extension, not file contents. A PNG renamed to `.txt` is rejected, and a non-image renamed to `.png` is sent to Gemini and will likely produce `EMPTY_RESPONSE` or `API_ERROR`.
- `API_ERROR` messages have `key=...` query-string values redacted, but still avoid pasting full error output anywhere public.

## Diagnosing `API_ERROR`

Read the message after `Gemini API request failed:`.
- Invalid or expired key: have the user create a new key and update the config.
- Quota or rate limit (429): wait and retry later, or reduce the number of calls. Combine questions into one prompt.
- Model not found: the default model may have been retired. Have the user set `GEMINI_MODEL` to a current vision-capable ID from https://ai.google.dev/gemini-api/docs/models.
- Network error: the machine running the server needs outbound access to Google's API.

## Verifying the setup

Ask the user for any small PNG, then call `ocr_image` or `analyze_image` on it. A text result means setup is complete. Standalone testing details (MCP Inspector, `npm start`) are in the project README.
