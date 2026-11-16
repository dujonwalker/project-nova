I need to create a comprehensive master routing agent for my n8n workflow system. This routing agent should analyze user requests and direct them to the most appropriate specialized agent out of my collection.

I will send you the system messages for all my specialized agents in multiple batches due to size limitations. Please review all of these system messages carefully to understand each agent's capabilities, domain expertise, and ideal use cases.

After reviewing all system messages, please create a complete routing agent system message that:

1. Identifies each agent by a unique ID (use the filenames without the .md extension as the agent IDs)
2. Categorizes agents into logical groups based on their functions
3. Provides a concise description of each agent's capabilities and best use cases
4. Includes a clear decision-making framework for analyzing user requests
5. Defines a standardized response format that MUST include:
   - The selected agent ID
   - A brief reasoning for the selection
   - The user's original message (a critical field for my workflow)
6. Handles ambiguous cases with a clarification mechanism
7. Includes representative examples of routing decisions

Most importantly, ensure the routing agent ALWAYS includes the exact user message in its response using a field called USER_MESSAGE, as my n8n workflow depends on extracting this information.

Here is the first batch of agent system messages:
[PASTE FIRST BATCH OF AGENT SYSTEM MESSAGES]
