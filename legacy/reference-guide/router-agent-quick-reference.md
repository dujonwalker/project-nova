# Router Agent Quick Reference

The Router Agent is the central hub of Project NOVA, responsible for analyzing user requests and directing them to the appropriate specialized agent. This document explains how the router works and provides tips for effective interaction.

## How the Router Agent Works

1. When you send a request to the Router Agent, it:
   - Analyzes the content and intent of your message
   - Matches it to the most appropriate specialized agent
   - Forwards your message to that agent
   - Returns the specialized agent's response

2. The routing decision is based on:
   - Specific mentions of platforms or tools
   - The type of task you're trying to accomplish
   - Domain-specific keywords in your request
   - Previous context in the conversation

## Supported Agent Domains

The Router Agent can direct your requests to specialized agents in these domains:

### Knowledge Management & Note-Taking
- TriliumNext Notes, Blinko, BookStack, Memos, Outline, SiYuan, Karakeep, Paperless, OnlyOffice

### Development & Repository Management
- CLI Server, Forgejo, Gitea, System Search

### Media & Creative Tools
- Ableton, OBS, Reaper, Reaper QA, YouTube

### AI & Automation
- Flowise, Langfuse, Puppeteer, RAGFlow, Fetch

### Monitoring & Home Automation
- Home Assistant, Prometheus

## Request Formatting Tips

For most efficient routing:

1. **Be specific about tools**: Mentioning a specific platform (e.g., "in Gitea" or "using Home Assistant") ensures accurate routing.

2. **Describe the task**: Clearly state what you want to accomplish (e.g., "search for", "create a", "control my").

3. **Include relevant keywords**: Domain-specific terminology helps identify the correct agent.

4. **Provide necessary context**: For file operations, include paths; for searches, include search terms.

## Example Requests

| Request Example | Likely Agent | Why |
|-----------------|--------------|-----|
| "Find my notes about machine learning" | TriliumNext/Outline/etc. | Note search request |
| "Create a new repository called project-x" | Gitea/Forgejo | Repository creation request |
| "Turn off the living room lights" | Home Assistant | Smart home control request |
| "Start recording my screen with OBS" | OBS | Streaming software control |
| "Find all PDF files in my Documents folder" | System Search | File system search |
| "Get the transcript from this YouTube video" | YouTube | Video transcript request |
| "Check server CPU usage for the last hour" | Prometheus | System monitoring request |
| "Fill out the form on this website" | Puppeteer | Web automation request |

## Ambiguous Request Handling

If your request is ambiguous (could be handled by multiple agents), the Router Agent will:

1. Ask clarifying questions to determine your intent
2. List potential agents that could handle your request
3. Allow you to specify which agent you'd prefer

Example of an ambiguous request:
"Create a new note about my meeting"

Possible clarification response:
```
CLARIFICATION NEEDED
POSSIBLE AGENTS: blinko-agent, memos-agent, triliumnext-agent, siyuan-agent
QUESTION: Which note-taking application would you like to use? Options include Blinko, Memos, TriliumNext Notes, or SiYuan Note.
```

## Advanced Usage Tips

1. **Multi-stage workflows**: For complex tasks involving multiple agents, break them into separate requests.

2. **Domain switching**: To switch between agents, clearly indicate the new tool or domain in your follow-up message.

3. **Continuing context**: The Router Agent maintains conversation context, so follow-up questions about the same topic will typically go to the same specialized agent.

4. **Explicit routing**: You can explicitly request a specific agent with "Using [agent name], do [task]" or "Ask the [agent name] to [task]".

5. **Feedback on routing**: If your request is routed to the wrong agent, you can say "This should go to [correct agent]" to redirect.

## Troubleshooting

- If the Router Agent consistently misroutes your requests, try being more explicit about the tool or domain.
- For complex or technical requests, include domain-specific terminology to help with accurate routing.
- If you receive an error from a specialized agent, check that the service or application is running and accessible.
- For permission issues, ensure that the specialized agent has the necessary access rights.

Remember that the Router Agent is designed to get you to the right specialized agent as efficiently as possible. The more specific your request, the more accurate the routing will be.
