# Development & Repository Management Agents

This manual covers all development and repository management agents in Project NOVA, their capabilities, tools, and example usage patterns.

## CLI Server Agent

**Description**: Provides secure command-line execution capabilities on the user's system.

### Available Tools
- `run_command`: Executes a single CLI command within allowed parameters
- `show_security_rules`: Displays current security configuration

### Security Restrictions
- Only whitelisted commands can be executed
- Only approved command flags/options can be used
- Operations limited to allowed directories
- Shell operators (&&, ||, |, >, etc.) are disabled by default
- Commands have length limits and execution timeouts

### Example Queries
- "Show me what security rules are in place for CLI execution"
- "List all files in my projects directory"
- "Check disk space usage on my system"
- "Find all JavaScript files in my current project"
- "Show the contents of my configuration file"

### Troubleshooting
- If a command fails, check if it's on the whitelist
- Path operations must stay within allowed directories
- Complex commands may need to be broken down into simpler ones
- Error types: CommandSecurityError, CommandTimeoutError, Path security violations

---

## Forgejo Agent

**Description**: Manages Forgejo Git repositories and issues.

### Available Tools
**User Management**
- `get_my_user_info`: Get authenticated user information
- `search_users`: Search for users

**Repository Management**
- `create_repo`: Create a new repository
- `fork_repo`: Fork a repository
- `list_my_repos`: List repositories owned by the user
- `search_repos`: Search for repositories

**Branch Operations**
- `create_branch`: Create a new branch
- `delete_branch`: Delete a branch
- `list_branches`: List all branches in a repository

**Commit Operations**
- `list_repo_commits`: List all commits in a repository

**File Operations**
- `get_file_content`: Get file content and metadata
- `create_file`: Create a new file
- `update_file`: Update an existing file
- `delete_file`: Delete a file

**Issue Management**
- `get_issue_by_index`: Get issue by index
- `list_repo_issues`: List all issues in a repository
- `create_issue`: Create a new issue
- `create_issue_comment`: Comment on an issue

**Pull Request Operations**
- `get_pull_request_by_index`: Get pull request by index
- `list_repo_pull_requests`: List all pull requests
- `create_pull_request`: Create a new pull request

**Other Operations**
- `search_org_teams`: Search for organization teams
- `get_forgejo_mcp_server_version`: Get server version

### Example Queries
- "List all my repositories"
- "Create a new repository called 'project-x'"
- "Fork the repository called 'awesome-tool'"
- "Show me the branches in my 'website' repository"
- "Create a new branch called 'feature/login' in 'my-app'"
- "Get the content of README.md in my 'docs' repo"
- "Show me all open issues in my 'bug-tracker' repository"
- "Create a pull request from 'fix-typo' to 'main' in 'my-blog'"

### Troubleshooting
- Repository names must follow Git naming conventions
- File paths are case-sensitive
- Branch operations require appropriate permissions
- Pull requests require valid source and target branches

---

## Gitea Agent

**Description**: Controls Gitea Git service for repository management.

### Available Tools
**User Management**
- Retrieve user information
- Get user organizations
- Search for users

**Repository Management**
- Create repositories
- Fork repositories
- List user repositories
- Search repositories

**Branch, Release, Tag Operations**
- Create, delete, and list branches
- Create, delete, and manage releases
- Create, delete, and list tags

**Commit Operations**
- List repository commits

**File Operations**
- Get, create, update, and delete files

**Issue Management**
- Get, list, create, and comment on issues

**Pull Request Operations**
- Get, list, and create pull requests

**Organization and Server Operations**
- Search organization teams
- Get server version

### Example Queries
- "Create a new repository called 'my-project'"
- "List all my Gitea repositories"
- "Show me the open pull requests in the 'website' repo"
- "Create a new branch called 'bugfix/login' from 'main'"
- "Add a file called 'README.md' to my project"
- "Show me the commits in my 'api' repository"
- "Create an issue about the login bug in the 'auth-service' repo"
- "Create a tag called 'v1.0.0' for the release"

### Troubleshooting
- Always check repository permissions before operations
- File paths must be provided correctly
- Branch names should follow standard conventions
- Pull requests require source and target branches to exist

---

## System Search Agent

**Description**: Finds files and folders across Linux file systems.

### Available Tools
- Universal File Search Tool with the following parameters:
  - `query` (required): Search term or pattern
  - `max_results` (optional): Limit number of results
  - `match_path` (optional): Search in full path
  - `match_case` (optional): Case-sensitive search
  - `match_whole_word` (optional): Match whole words
  - `match_regex` (optional): Enable regex search
  - `sort_by` (optional): Sort order for results

### Search Syntax
- Basic wildcards: `*` (any characters), `?` (single character), `[]` (character classes)
- Advanced options: case-insensitive, regex, full path matching

### Example Queries
- "Find all PDF files in my home directory"
- "Search for configuration files in /etc"
- "Find all files starting with 'project' in my Documents folder"
- "Look for any files modified in the last week"
- "Find all Python scripts containing the word 'database'"
- "Search for files with 'report' in the name, case insensitive"

### Troubleshooting
- Use wildcard patterns for more flexible searches
- Enable regex for complex pattern matching
- This tool can only search for files, not access their contents
- The tool uses the `locate` command under the hood
