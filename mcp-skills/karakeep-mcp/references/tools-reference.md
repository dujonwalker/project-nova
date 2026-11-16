# `karakeep-mcp` Tools Reference (29 Tools)

No MCP resources or prompts are exposed; all operations use tools.

## Bookmarks (7)

| Tool | Purpose / Key Arguments |
| :--- | :--- |
| `search-bookmarks` | Search bookmarks: `query`, `limit` (default `10`), `nextCursor`, `sortOrder` (`asc`, `desc`, `relevance`), `searchMode` (`fts`, `semantic`, `hybrid`) |
| `get-bookmark` | Get compact bookmark metadata by `bookmarkId` (excludes full content) |
| `get-bookmark-content` | Get full bookmark content as Markdown (link HTML converted via Turndown) by `bookmarkId` |
| `get-bookmark-lists` | List every list containing `bookmarkId` |
| `create-bookmark` | Create `type: "link"` (URL in `content`) or `type: "text"` (note in `content`), optional `title` |
| `update-bookmark` | Partial update by `bookmarkId` (`title`, `note`, `summary`, `archived`, `favourited`, `url`, `description`, `author`, `publisher`, `createdAt`; `null` clears nullable fields) |
| `delete-bookmark` | Permanently delete bookmark, its highlights, and its assets by `bookmarkId` |

## Lists (8)

| Tool | Purpose / Key Arguments |
| :--- | :--- |
| `get-lists` | List all lists |
| `get-list` | Get single list by `listId` |
| `create-list` | Create a list (`name`, `icon` emoji, optional `description`, `parentId`, `query`, `public`) |
| `update-list` | Partial update by `listId` |
| `delete-list` | Delete list by `listId` (bookmarks kept; child lists become root-level `parentId: null`) |
| `get-list-bookmarks` | List bookmarks in manual or smart list (`listId`, `limit`, `nextCursor`) |
| `add-bookmark-to-list` | Add `bookmarkId` to `listId` |
| `remove-bookmark-from-list` | Remove `bookmarkId` from `listId` |

## Tags (7)

| Tool | Purpose / Key Arguments |
| :--- | :--- |
| `get-tags` | List tags with bookmark counts (`nameContains`, `sort`: `name`/`usage`/`relevance`, `attachedBy`: `ai`/`human`/`none`, `cursor`, `limit` — no default `limit`) |
| `get-tag` | Get single tag + counts by `tagId` |
| `update-tag` | Rename tag by `tagId` (server normalizes name) |
| `delete-tag` | Delete tag by `tagId` (detaches from bookmarks; bookmarks kept) |
| `get-tag-bookmarks` | List bookmarks with `tagId` |
| `attach-tag-to-bookmark` | Attach tag names (`tagsToAttach: string[]`) to `bookmarkId` |
| `detach-tag-from-bookmark` | Detach tag names (`tagsToDetach: string[]`) from `bookmarkId` |

## Highlights (6) & Assets (1)

| Tool | Purpose / Key Arguments |
| :--- | :--- |
| `list-highlights` | List highlights across all bookmarks, newest first (`limit`, `nextCursor`) |
| `get-bookmark-highlights` | List highlights on `bookmarkId` |
| `get-highlight` | Get highlight by `highlightId` |
| `create-highlight` | Create highlight on `bookmarkId` using readable-content `startOffset`/`endOffset`, `color` (`yellow`, `red`, `green`, `blue`), optional `note` |
| `update-highlight` | Update highlight `color` or `note` by `highlightId` |
| `delete-highlight` | Delete highlight by `highlightId` |
| `get-asset` | Get temporary signed download URL (`signedUrl`, `expiresAt`) for `assetId` |
