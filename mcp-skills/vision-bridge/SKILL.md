---
name: vision-bridge
description: Read and understand images through the vision-bridge MCP server (analyze_image and ocr_image tools, backed by Gemini) when the agent's own model cannot see images. Use this skill whenever the user mentions or attaches an image file (.png .jpg .jpeg .webp .gif .heic .heif) such as a screenshot, error dialog, terminal capture, UI mockup, diagram, whiteboard photo, chart, or scanned note, or says things like "look at this screenshot", "what does the error say", "read the text in this image", or "build this from the mockup", even if they never mention OCR or vision. Not for generating or editing images.
compatibility: Requires the vision-bridge-mcp MCP server connected (tools analyze_image and ocr_image), Node.js 18+, and a GEMINI_API_KEY configured for the server.
---

# Vision Bridge

A text-only model cannot see images. The vision-bridge MCP server fixes that by sending a local image to Gemini and returning text. What the tools return is your only view of the image, and it is a description written by a different model, so treat it as good but secondhand evidence.

## Step 0: decide whether you need it

- If your own model can already see the image (it is in your context), just look at it. Do not make a round trip for nothing.
- If you only have a file path, or you cannot see the image, use the tools below.
- The tools may be exposed with the server name as a prefix (for example `vision-bridge_analyze_image`), depending on the client.
- If neither tool is available, the server is not connected. Read `references/setup.md`, tell the user what is missing, and stop. Do not guess at image contents.

## Step 1: pick the tool

| Need | Tool |
| --- | --- |
| Exact text: error messages, stack traces, terminal output, code, config, serial numbers | `ocr_image` (takes only `image_path`; returns just the text, no commentary) |
| Anything else: what a UI looks like, diagram structure, chart data, what is wrong in a screenshot | `analyze_image` (takes `image_path` and an optional `prompt`) |

When an image has both verbatim text that matters and visual structure that matters (a screenshot of a failing page, say), call both. Use `ocr_image` for the precise strings and `analyze_image` with a targeted prompt for layout and context.

## Step 2: call it well

**Paths.** Prefer absolute paths. Relative paths resolve against the directory the MCP server was started in, which is usually where the agent was launched but not always. If you get `FILE_NOT_FOUND`, the error message shows the absolute path it tried, so use that to see what went wrong and retry with an absolute path.

**Local files only.** The tools cannot take URLs, clipboard contents, base64, SVG, BMP, TIFF, or PDFs. Format is detected from the file extension only. Convert first, then call:
- URL: download it to a temp file (`curl -L -o /tmp/img.png <url>`)
- Unsupported format: convert to PNG (ImageMagick `magick in.bmp out.png`, macOS `sips -s format png in.bmp --out out.png`, or Pillow)
- PDF page: render it (`pdftoppm -png -r 150 -f 1 -l 1 in.pdf /tmp/page`)

**One image per call.** For several images, call once per image, then combine the results yourself.

**Size.** Files over 20MB are rejected by default. Downscale the image rather than asking the user to raise the limit.

**Write a specific prompt for `analyze_image`.** The built-in default is a generic "describe this for a developer" prompt. It works, but a prompt tied to the user's actual goal gets you the detail you need in one call instead of two. Say what you need to know and what shape you want it in. Each call is a network round trip against a rate-limited free quota, so ask for everything you need at once.

- Debugging: "Transcribe the error message and stack trace exactly. Then describe what the app was doing and which UI state is visible."
- Mockup to code: "List every UI element top to bottom with its label, position in the layout, and any visible state. Estimate colors as hex values."
- Diagram: "List every node and every connection as 'A -> B (label)'. Note anything that looks like a decision point."

More recipes by image type are in `references/prompt-recipes.md`. Read it when the image is a chart, a table, a mockup, or a photo of handwriting.

## Step 3: treat the result as evidence, not ground truth

- **Verify what you can.** If the output contains an error string, grep the codebase for it. If it contains code, run or lint it. Vision models confuse `l`/`1`/`I` and `O`/`0` and sometimes drop a line.
- **Do not state measurements as fact.** Colors, pixel sizes, and spacing are estimates. Say "approximately" or ask the user for the real values from the design file.
- **Ask a follow-up when something critical is unclear.** If the whole task hinges on one number, path, or label, run a second narrow `analyze_image` or `ocr_image` call on it instead of building on a guess.
- **Be honest about gaps.** If the description seems incomplete or contradicts itself, say so. Do not fill the gaps with plausible details.
- **Say where the information came from.** Note in your answer that you read the image through the vision tool, so the user knows to double-check anything surprising.

## Privacy

The image is uploaded to Google's Gemini API. If the user says the image is sensitive (credentials, customer data, private documents) or the filename suggests it, confirm they are comfortable with that before calling. If secrets show up in the output (API keys, tokens, passwords), do not copy them into files, commits, or logs, and flag them to the user.

## When a call fails

Failures come back as `isError: true` with a message shaped like `[CODE] explanation`. Fix the cause and retry at most once. Do not loop.

| Code | Meaning | What to do |
| --- | --- | --- |
| `MISSING_API_KEY` | `GEMINI_API_KEY` is not set for the server | Tell the user to set it (see `references/setup.md`). Never ask them to paste the key into chat. This check runs before path validation, so it can mask other errors. |
| `FILE_NOT_FOUND` | Path does not exist | Check the absolute path shown in the message; retry with the correct absolute path |
| `NOT_A_FILE` | Path is a directory | Locate the actual image file inside it |
| `UNSUPPORTED_TYPE` | Extension not in the supported list | Convert to PNG, then retry |
| `FILE_TOO_LARGE` | Over the size limit | Downscale or compress, then retry |
| `READ_ERROR` | Unreadable or empty file | Confirm the file is not empty or corrupted and that permissions allow reading |
| `API_ERROR` | Gemini rejected the request (bad key, quota, retired model, network) | Read the message; see `references/setup.md` for key, quota, and `GEMINI_MODEL` issues |
| `EMPTY_RESPONSE` | Gemini returned nothing, often a safety filter | Retry with a different prompt or a cropped image; if it persists, tell the user |
