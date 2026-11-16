# AI & Automation Agents

This manual covers all AI and automation agents in Project NOVA, their capabilities, tools, and example usage patterns.

## Flowise Agent

**Description**: Connects to Flowise chatflows and AI assistants.

### Available Tools
- **LowLevel Mode (Default)**:
  - Each chatflow is registered as a separate tool
  - Tool names are based on chatflow names (normalized)
  - Example: `document_qa(question: str)` for a "Document QA" chatflow

- **FastMCP Mode**:
  - `list_chatflows()`: Returns all available chatflows and descriptions
  - `create_prediction(chatflow_id: str, question: str)`: Sends a query to a specific chatflow

### Example Queries
- "What chatflows are available to me?"
- "Use the document_qa chatflow to answer a question about our policy document"
- "Process this text through the summarization chatflow"
- "Can you analyze this data using the data_insights chatflow?"
- "Help me generate ideas using the brainstorming chatflow"
- "Translate this text using the language_translator"

### Troubleshooting
- For insufficient responses, try different chatflows
- If unsure which chatflow to use, list all available options first
- Some specialized tasks may require breaking down into subtasks
- If a chatflow doesn't perform as expected, fall back to standard AI capabilities

---

## Langfuse Agent

**Description**: Accesses managed prompts from Langfuse.

### Available Tools
- `prompts/list`: Lists available prompts from the Langfuse account
- `prompts/get`: Retrieves and compiles a specific prompt with variables

**Alternative Tool Functions**:
- `get-prompts`: Lists available prompts (same as prompts/list)
- `get-prompt`: Retrieves and compiles a specific prompt (same as prompts/get)

### Example Queries
- "What prompts are available in my Langfuse account?"
- "Use the 'product-description' prompt to create content for my new app"
- "Get the 'customer-support' prompt and fill it with details about my issue"
- "Show me all available Langfuse prompts that could help with marketing"
- "Use the 'bug-report' prompt template for my software issue"

### Troubleshooting
- Only prompts with a "production" label in Langfuse will be available
- All arguments in prompts are treated as optional
- The system is already configured with necessary Langfuse API keys
- Prompt listing may be slower as it requires fetching each prompt individually

---

## Puppeteer Agent

**Description**: Provides browser automation for web scraping and testing.

### Available Tools
- `puppeteer_navigate`: Navigate to any URL
- `puppeteer_screenshot`: Capture images of pages or elements
- `puppeteer_click`: Click on elements using CSS selectors
- `puppeteer_hover`: Hover over elements
- `puppeteer_fill`: Enter text into input fields
- `puppeteer_select`: Choose options from dropdowns
- `puppeteer_evaluate`: Execute custom JavaScript

### Example Queries
- "Visit example.com and take a screenshot"
- "Fill out the contact form on this website"
- "Click the login button and enter my credentials"
- "Extract all the product prices from this page"
- "Navigate to the news site and get the latest headlines"
- "Take a screenshot of just the main article on this page"
- "Go through a multi-step form submission process"

### Troubleshooting
- Always use `puppeteer_navigate` before other actions
- Use specific CSS selectors when targeting elements
- Account for page loading times between actions
- For errors, check if elements are present on the page
- Use `puppeteer_evaluate` cautiously for custom scripts
- Never set allowDangerous to true unless absolutely necessary

---

## RAGFlow Agent

**Description**: Retrieval-augmented generation with source citations.

### Available Tools
- `retrieve_knowledge`: Queries a document-grounded knowledge base

### Example Queries
- "What does our company policy say about remote work?"
- "Find information about the product launch timeline"
- "According to our documentation, what's the process for customer returns?"
- "What are the system requirements according to the technical docs?"
- "Search our knowledge base for information about employee benefits"

### Troubleshooting
- The agent only uses information from the document database
- All responses must include citations or source links
- If no relevant content is found, the agent will clearly state this
- The agent will not generate answers from its own knowledge
- Always requires using the retrieve_knowledge tool before responding

---

## Fetch Agent

**Description**: Retrieves web content from URLs with advanced options.

### Available Tools
- `fetch_html`: Retrieve raw HTML content
- `fetch_json`: Retrieve and parse JSON data
- `fetch_txt`: Extract plain text content
- `fetch_markdown`: Convert webpage to Markdown format

### Example Queries
- "Get the HTML structure of this landing page"
- "Fetch the current weather data from this API"
- "Extract the text from this news article"
- "Convert this documentation page to Markdown"
- "Show me the JSON response from this endpoint"
- "Get the content of this blog post without all the HTML formatting"

### Troubleshooting
- Some websites may block automated access
- Large pages may be truncated (default: 5000 characters)
- Starting point can be specified with start_index parameter
- Custom headers can be added when needed
- For auth-required sites, special configuration may be needed
- If fetch fails, try different format or check URL encoding
