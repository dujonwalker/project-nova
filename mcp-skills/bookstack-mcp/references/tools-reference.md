# `bookstack-mcp` Tools, Resources & Prompts

## Read Tools (21 — always registered)

| Tool | Purpose / Key Arguments |
| :--- | :--- |
| `search_content` | Full-text search: `query`, optional `type`, `count`, `offset` |
| `search_pages` | Page search: `query`, optional `book_id`, `count`, `offset` |
| `get_books` | List books with `offset`, `count`, `filter`, `sort` |
| `get_book` | Read a book by `id` |
| `get_pages` | List pages, optionally by `book_id` or `chapter_id` |
| `get_page` | Read a page by `id` in `format` (`markdown`, `html`, `text`, `raw`) with `offset`/`limit` |
| `get_chapters` | List chapters, optionally by `book_id` |
| `get_chapter` | Read a chapter by `id` |
| `get_shelves` | List shelves |
| `get_shelf` | Read a shelf and its books by `id` |
| `get_attachments` | List attachments |
| `get_attachment` | Get attachment metadata and `download_url` by `id` |
| `get_comments` | List comments, optionally by `page_id` (BookStack v25.11+) |
| `get_comment` | Read a comment by `id` (BookStack v25.11+) |
| `list_images` | List gallery images, optionally by `uploaded_to` page ID |
| `find_users` | Resolve partial name/email/slug to a user slug (requires admin) |
| `get_recycle_bin` | List deleted items and their `deletion_id` (requires admin) |
| `export_page` | Export page by `id` and `format` (`html`, `markdown`, `plaintext`, `pdf`, `zip`) |
| `export_book` | Export book by `id` and `format` |
| `export_chapter` | Export chapter by `id` and `format` |
| `get_recent_changes` | Recently updated content (`type`, `days` default 30, `limit` default 20 / max 100) |

## Write Tools (22 — requires `BOOKSTACK_ENABLE_WRITE=true`)

| Tool | Purpose / Notes |
| :--- | :--- |
| `create_book` / `update_book` / `delete_book` | Manage books; deletion moves to recycle bin |
| `create_chapter` / `update_chapter` / `delete_chapter` | Manage chapters; move via `book_id`, reorder via `priority` |
| `create_page` / `update_page` / `delete_page` | Manage page source (`markdown` or `html`), location, `tags`, `changelog` |
| `create_shelf` / `update_shelf` / `delete_shelf` | Manage shelf metadata and book membership |
| `create_attachment` / `update_attachment` / `delete_attachment` | Create **link** attachments (`name`, `uploaded_to`, `link`), update metadata, or delete |
| `create_image` / `delete_image` | Upload gallery image (`url` or `file_path`) to `uploaded_to`, or delete image + thumbnails |
| `create_comment` / `update_comment` / `delete_comment` | Comment HTML, threaded `parent_id` replies, `archived` toggle (v25.11+) |
| `restore_deleted` / `permanently_delete` | Restore or permanently delete by `deletion_id` (requires admin) |

## MCP Resources & Prompts

| Resource Template | Content |
| :--- | :--- |
| `bookstack://book/{id}` | Book metadata as JSON (supports ID completion) |
| `bookstack://page/{id}` | Markdown and page metadata (supports ID completion) |

| Prompt | Arguments | Workflow |
| :--- | :--- | :--- |
| `answer_from_wiki` | `question` | Search, read, answer with source citations |
| `find_pages` | `topic` | Ranked search results with previews and URLs |
| `summarize_book` | `book` (name or ID) | Structured book summary with source links |
| `recent_changes` | Optional `days` (default `"30"`) | Summarize recent updates |
