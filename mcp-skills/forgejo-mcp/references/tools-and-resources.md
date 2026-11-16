# `forgejo-mcp` Tools & `forgejo://` Resources

## Tools by Domain

- **User & Notifications**: `get_my_user_info`, `check_notifications`, `get_notification_thread`, `mark_notification_read`, `mark_all_notifications_read`, `list_repo_notifications`, `mark_repo_notifications_read`, `search_users`
- **Repositories & Topics**: `list_my_repos`, `get_repo`, `create_repo`, `fork_repo`, `edit_repo`, `search_repos`, `list_repo_topics`, `set_repo_topics`, `add_repo_topic`, `delete_repo_topic`
- **Branches & Branch Protection**: `list_branches`, `create_branch`, `delete_branch`, `list_branch_protections`, `get_branch_protection`, `create_branch_protection`, `edit_branch_protection`, `delete_branch_protection`
- **Webhooks**: `list_repo_hooks`, `get_repo_hook`, `create_repo_hook`, `edit_repo_hook`, `delete_repo_hook`, `test_repo_hook`
- **Files & Commits**: `get_file_content`, `list_repo_contents`, `get_repo_tree`, `create_file`, `update_file`, `delete_file`, `change_files`, `list_repo_commits`, `get_commit_statuses`
- **Issues, Dependencies, Milestones & Labels**: `list_repo_issues`, `search_issues`, `get_issue_by_index`, `create_issue`, `update_issue`, `issue_state_change`, `add_issue_labels`, `remove_issue_labels`, `list_issue_dependencies`, `list_issue_dependents`, `add_issue_dependency`, `remove_issue_dependency`, `list_repo_milestones`, `list_repo_labels`, `list_org_labels`, `get_repo_label`, `create_repo_label`, `edit_repo_label`, `delete_repo_label`, `get_org_label`, `create_org_label`, `edit_org_label`, `delete_org_label`
- **Comments**: `list_issue_comments`, `get_issue_comment`, `create_issue_comment`, `edit_issue_comment`, `delete_issue_comment`
- **Pull Requests & Reviews**: `list_repo_pull_requests`, `get_pull_request_by_index`, `create_pull_request`, `update_pull_request`, `list_pull_reviews`, `get_pull_review`, `list_pull_review_comments`, `list_pull_request_files`, `get_pull_request_diff`, `merge_pull_request`, `create_pull_review`, `submit_pull_review`, `dismiss_pull_review`, `delete_pull_review`, `create_review_requests`, `delete_review_requests`
- **Packages**: `list_packages`, `get_package`, `delete_package`, `list_package_files`
- **Actions**: `dispatch_workflow`, `list_workflow_runs`, `get_workflow_run`, `list_action_run_jobs`, `get_action_job_logs`, `cancel_workflow_run`, `delete_workflow_run`, `list_action_run_artifacts`, `get_action_artifact`, `list_repo_action_secrets`, `create_or_update_repo_action_secret`, `delete_repo_action_secret`, `list_org_action_secrets`, `create_or_update_org_action_secret`, `delete_org_action_secret`
- **Organizations & Teams**: `list_my_orgs`, `list_user_orgs`, `get_org`, `create_org`, `edit_org`, `delete_org`, `list_org_members`, `check_org_membership`, `remove_org_member`, `list_org_teams`, `search_org_teams`, `create_org_team`, `add_team_member`, `remove_team_member`, `add_team_repo`, `remove_team_repo`
- **Time Tracking**: `list_issue_tracked_times`, `list_repo_tracked_times`, `list_my_tracked_times`, `add_issue_time`, `reset_issue_time`, `delete_issue_time_entry`, `start_issue_stopwatch`, `stop_issue_stopwatch`, `cancel_issue_stopwatch`, `list_my_stopwatches`
- **Attachments**: `list_issue_attachments`, `get_issue_attachment`, `download_issue_attachment`, `create_issue_attachment`, `edit_issue_attachment`, `delete_issue_attachment`, `list_comment_attachments`, `get_comment_attachment`, `download_comment_attachment`, `create_comment_attachment`, `edit_comment_attachment`, `delete_comment_attachment`
- **Releases**: `list_releases`, `get_release_by_id`, `get_release_by_tag`, `get_latest_release`, `create_release`, `edit_release`, `delete_release`, `delete_release_by_tag`, `list_release_attachments`, `get_release_attachment`, `download_release_attachment`, `create_release_attachment`, `edit_release_attachment`, `delete_release_attachment`
- **Wiki & Server**: `list_wiki_pages`, `get_wiki_page`, `get_wiki_revisions`, `create_wiki_page`, `update_wiki_page`, `delete_wiki_page`, `get_forgejo_mcp_server_version`

## `forgejo://` Resource URI Templates

Supported in Claude Code, Claude Desktop, Codex, and Cursor. Embedded lists cap at `30` items with a sentinel naming the corresponding `list_*` tool.

| URI Template | Notes |
| :--- | :--- |
| `forgejo://owner/{owner}` | User or org profile (resolves user first, falls back to org) |
| `forgejo://repo/{owner}/{repo}` | Repo overview + counts (no embedded lists) |
| `forgejo://repo/{owner}/{repo}/commit/{sha}` | Immutable commit metadata (`sha` must be 40 hex chars) |
| `forgejo://repo/{owner}/{repo}/commit/{sha}/status` | Combined CI status + bounded per-context statuses |
| `forgejo://repo/{owner}/{repo}/issue/{index}` | Issue metadata, body, and bounded comments |
| `forgejo://repo/{owner}/{repo}/issues{?state,labels,page,limit}` | Issue list rows without bodies (`state`: `open`/`closed`/`all`) |
| `forgejo://repo/{owner}/{repo}/{kind}/{index}/comment/{id}` | Single comment (`kind`: `issue` or `pr`) |
| `forgejo://repo/{owner}/{repo}/{kind}/{index}/comments{?page,limit}` | Bounded comment thread with full bodies |
| `forgejo://repo/{owner}/{repo}/pr/{index}` | PR metadata, refs, mergeability, bounded comments & reviews |
| `forgejo://repo/{owner}/{repo}/branch_protections` | Bounded list of branch protection rules |
| `forgejo://repo/{owner}/{repo}/branch_protection/{rule}` | Single rule (`%2F` for `/`, `%20` for spaces) |
| `forgejo://repo/{owner}/{repo}/hooks` | Bounded webhook list (secrets omitted) |
| `forgejo://repo/{owner}/{repo}/hook/{id}` | Single webhook (secret omitted) |
| `forgejo://repo/{owner}/{repo}/label/{id}` | Single repository label by numeric ID |
| `forgejo://repo/{owner}/{repo}/labels{?page,limit}` | Bounded repository labels |
| `forgejo://org/{org}/labels{?page,limit}` | Bounded organization labels |
| `forgejo://repo/{owner}/{repo}/wiki/{pageName}` | Wiki page (`%2F` for `/`, `%20` for spaces; max 1 MiB) |
