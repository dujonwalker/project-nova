# Knowledge Management & Note-Taking Agents

This manual covers all knowledge management and note-taking agents in Project NOVA, their capabilities, tools, and example usage patterns.

## TriliumNext Notes Agent

**Description**: Controls TriliumNext Notes knowledge base application with hierarchical organization.

### Available Tools
- `search_notes`: Search through notes with optional parameters
- `get_note`: Retrieve a note's content by ID
- `create_note`: Create a new note under a parent
- `update_note`: Modify an existing note
- `delete_note`: Remove a note

### Example Queries
- "Find all my notes about project planning"
- "Create a new note about machine learning under my Tech parent note"
- "Update my meeting notes from yesterday with the action items"
- "Get the content of my Python code note"
- "Search for notes with the tag 'priority'"

### Troubleshooting
- If search returns no results, try different keywords or use attribute-based queries
- When creating notes, ensure you specify a valid parent note ID
- For code notes, specify the correct MIME type for proper syntax highlighting

---

## Blinko Agent

**Description**: Manages notes in the Blinko note-taking service, including flash notes and regular notes.

### Available Tools
- `upsert_blinko_flash_note`: Create/update a flash note
- `upsert_blinko_note`: Create/update a regular note
- `share_blinko_note`: Share a note with others
- `search_blinko_notes`: Find notes with various filters
- `review_blinko_daily_notes`: Get today's notes
- `clear_blinko_recycle_bin`: Empty the recycle bin

### Example Queries
- "Create a quick flash note about the meeting tomorrow"
- "Write a detailed note about the project requirements"
- "Find all my notes about recipes from last month"
- "Share my vacation plans note with a password"
- "Show me all the notes I wrote today"
- "Clear my recycle bin"

### Troubleshooting
- For detailed formatting, use regular notes instead of flash notes
- When searching, utilize date ranges and type filters for better results
- Password for sharing must be six digits

---

## BookStack Agent

**Description**: Interfaces with BookStack documentation and wiki platform.

### Available Tools
- `search_pages`: Search and retrieve content from BookStack

### Example Queries
- "Find documentation about our API authentication"
- "Search BookStack for information about the onboarding process"
- "Show me pages related to project management in our wiki"
- "Get information about the deployment pipeline from BookStack"
- "Find all pages that mention Docker in our documentation"

### Troubleshooting
- If search returns too many results, use more specific terms
- Results are limited to the organization's BookStack instance
- Pages are returned with their title and URL for reference

---

## Memos Agent

**Description**: Works with lightweight Memos note-taking application.

### Available Tools
- `search_memos`: Find existing memos by keyword
- `create_memo`: Create a new memo with optional visibility setting

### Example Queries
- "Create a memo that I need to call John tomorrow"
- "Find my memos about the project deadline"
- "Search for any notes I've taken about the client meeting"
- "Create a private memo with my password information"
- "Take a quick note about the book recommendation"

### Troubleshooting
- Memos are tagged with #mcp by default
- Visibility options: "PUBLIC", "PROTECTED", or "PRIVATE"
- Search before creating to avoid duplicate memos

---

## Outline Agent

**Description**: Manages Outline knowledge base for team documentation.

### Available Tools
**Document Management**
- Create, retrieve, update, and delete documents
- List and search documents
- Move documents between collections
- Archive documents

**Collection Management**
- Get collection information
- List all collections
- Create and update collections

**Comment Management**
- Create, update, and delete comments

**User Management**
- List and filter users

### Example Queries
- "Create a new document about our API documentation"
- "Find all documents related to onboarding"
- "Move the expense policy document to the HR collection"
- "Archive outdated documents about the old system"
- "List all collections in our Outline workspace"
- "Add a comment to the meeting notes from yesterday"

### Troubleshooting
- Document content supports Markdown formatting
- Always confirm before making destructive changes
- Document operations require appropriate permissions

---

## SiYuan Agent

**Description**: Controls SiYuan Note personal knowledge management system.

### Available Tools
- `executeCommand`: Run SiYuan commands
- `queryCommands`: List available commands
- `help`: Get documentation about commands

### Available Commands
**Notebook Management**
- List, open, create, rename, and remove notebooks
- Get and set notebook configuration

**Document Operations**
- Create, rename, remove, and move documents
- Get document paths

**Block Operations**
- Insert, update, delete, and move blocks
- Get block content

**Search and Query**
- Full text search
- Execute SQL queries

### Example Queries
- "List all my notebooks in SiYuan"
- "Create a new document with my meeting notes"
- "Search for all mentions of 'project alpha' in my notes"
- "Move my finance documents to the Personal notebook"
- "Update the content of my TODO list"
- "Run an SQL query to find all documents created this month"

### Troubleshooting
- SiYuan uses blocks as the fundamental unit (paragraphs, headings, lists)
- SQL queries allow for complex data retrieval
- Command execution may require multiple steps for complex operations

---

## Karakeep Agent

**Description**: Organizes digital content collections and bookmarks.

### Available Tools
- Search bookmarks by keywords, tags, or content
- Manage lists of bookmarks
- Handle tag management
- Add new bookmarks (URLs or text notes)

### Example Queries
- "Save this article about AI advancements"
- "Find my notes about Project X"
- "Create a new list for research papers"
- "Add tags to my bookmarks about cooking"
- "Search for all bookmarks related to machine learning"
- "Add this recipe to my Cooking list"

### Troubleshooting
- When adding content, suggest appropriate tags and lists
- Confirm before modifying or deleting content
- Organization helps with future information retrieval

---

## Paperless Agent

**Description**: Manages Paperless-NGX document management system.

### Available Tools
**Document Operations**
- `list_documents`: Get paginated document list
- `get_document`: Retrieve specific document
- `search_documents`: Full-text search
- `download_document`: Get document file
- `bulk_edit_documents`: Batch operations
- `post_document`: Upload new document

**Tag Operations**
- `list_tags`: Get all tags
- `create_tag`: Create new tag

**Correspondent Operations**
- `list_correspondents`: Get all correspondents
- `create_correspondent`: Create new correspondent

**Document Type Operations**
- `list_document_types`: Get all document types
- `create_document_type`: Create new document type

### Example Queries
- "Find all my invoices from last month"
- "Upload this receipt to Paperless"
- "Create a new tag for tax documents"
- "Search for any documents mentioning the Smith contract"
- "Download invoice #1234"
- "Show me all documents from Acme Corporation"

### Troubleshooting
- Present search results in tabular format
- Confirm details before creating new items
- Always confirm before bulk operations
- For uploads, guide on providing file content

---

## OnlyOffice Agent

**Description**: Manages ONLYOFFICE DocSpace for document collaboration.

### Available Tools
**File and Folder Management**
- `files_delete_file`, `files_update_file`, `files_get_file_info`
- `files_create_folder`, `files_delete_folder`, `files_get_folder`
- `files_get_folder_info`, `files_get_folders`, `files_get_my_folder`
- `files_rename_folder`, `files_get_rooms_folder`
- `others_download_as_text`, `others_upload_file`

**Batch Operations**
- `files_copy_batch_items`, `files_move_batch_items`, `files_get_operation_statuses`

**Room Management**
- `files_create_room`, `files_update_room`, `files_archive_room`
- `files_get_room_info`, `files_get_room_security_info`, `files_set_room_security`

**User Management**
- `people_get_all`

### Example Queries
- "Create a folder called 'Project X' in My Documents"
- "List all users in the system"
- "Show me the files in my documents"
- "Create a new room for the Marketing team"
- "Upload this presentation to the Sales room"
- "Who has access to the Finance room?"

### Troubleshooting
- Folder creation requires both parentId and title parameters
- Room creation requires title parameter
- File operations may need multiple steps
- Always get folder ID before creating subfolders
