# `gitea-mcp` Tools Reference

All 48 tools exposed by `gitea-mcp`, their `-S`/`--scope` name, and Read/Write access level. Passing `-r` (`GITEA_READONLY=true`) hides all **Write** tools.

| Tool | Scope | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `get_gitea_mcp_server_version` | `version` | Read | Get the `gitea-mcp` server version |
| `get_me` | `user` | Read | Get the current authenticated user |
| `get_user_orgs` | `user` | Read | List the current user's organizations |
| `create_organization` | `user` | Write | Create a new organization |
| `search_users` | `search` | Read | Search for users |
| `search_org_teams` | `search` | Read | Search teams within an organization |
| `search_repos` | `search` | Read | Search for repositories |
| `search_issues` | `search` | Read | Full-text search of issues and PRs across repos |
| `notification_read` | `notification` | Read | List notifications or get a thread |
| `notification_write` | `notification` | Write | Mark notifications as read |
| `label_read` | `label` | Read | Read repository or organization labels |
| `label_write` | `label` | Write | Write repository or organization labels |
| `milestone_read` | `milestone` | Read | Read milestones |
| `milestone_write` | `milestone` | Write | Write milestones |
| `wiki_read` | `wiki` | Read | Read wiki pages and revisions |
| `wiki_write` | `wiki` | Write | Write wiki pages |
| `timetracking_read` | `timetracking` | Read | Read tracked times and stopwatches |
| `timetracking_write` | `timetracking` | Write | Write stopwatches and tracked times |
| `package_read` | `package` | Read | Read packages and versions |
| `package_write` | `package` | Write | Delete a package version (irreversible) |
| `project_read` | `project` | Read | Read projects, columns, and column issues |
| `project_write` | `project` | Write | Write projects, columns, and issue placement |
| `list_issues` | `issue` | Read | List repository issues |
| `issue_read` | `issue` | Read | Read an issue with comments, labels, dependencies, attachments |
| `issue_write` | `issue` | Write | Write issues, comments, labels, dependencies, attachments |
| `list_pull_requests` | `pull_request` | Read | List repository pull requests |
| `pull_request_read` | `pull_request` | Read | Read PR diff, files, commits, status, reviews, comments, or find by branch/commit |
| `pull_request_write` | `pull_request` | Write | Create, update, merge, close, reopen PRs, update branch, manage reviewers |
| `pull_request_review_write` | `pull_request` | Write | Create, submit, delete, dismiss reviews; reply to and resolve review comments |
| `actions_config_read` | `actions` | Read | Read Actions secrets and variables |
| `actions_config_write` | `actions` | Write | Write Actions secrets and variables |
| `actions_run_read` | `actions` | Read | Read Actions workflows, runs, jobs, logs, and artifacts |
| `actions_run_write` | `actions` | Write | Dispatch, cancel, rerun, approve Actions runs; toggle workflows |
| `repo_read` | `repository` | Read | Read a repository, list yours/org's, read branch protections |
| `repo_write` | `repository` | Write | Create, fork, update settings/topics, manage branch protections |
| `get_repository_tree` | `repository` | Read | Get the repository file tree |
| `get_file_contents` | `file` | Read | Get file content and metadata, or list a directory |
| `get_dir_contents` | `file` | Read | Get the entries in a directory |
| `create_or_update_file` | `file` | Write | Create, update, rename, or delete files in one commit |
| `delete_file` | `file` | Write | Delete a file |
| `branch_read` | `branch` | Read | Read branches |
| `branch_write` | `branch` | Write | Create, delete, or rename branches |
| `tag_read` | `tag` | Read | Read tags |
| `tag_write` | `tag` | Write | Create or delete tags |
| `commit_read` | `commit` | Read | Read commits with optional diff, combined statuses, compare refs |
| `commit_write` | `commit` | Write | Create a commit status |
| `release_read` | `release` | Read | Read releases by ID, tag, or latest; list or download assets |
| `release_write` | `release` | Write | Write releases; upload or delete assets |

## Filtering Examples

```bash
# Only issue and pull_request tools
gitea-mcp -S issue,pull_request

# Union of repository + branch scopes plus get_me
gitea-mcp -S repository,branch -O get_me

# Read-only mode (hides all Write tools)
gitea-mcp -r -H https://gitea.example.com
```
