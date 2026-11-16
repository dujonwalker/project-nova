# `mcp-shell` Tools Reference

Tool registration depends on whether `mcp-shell` is booted in **Unrestricted Mode** or **Secure Mode** (`sonirico/mcp-shell` `v1.1.1`).

## Unrestricted Mode (`MCP_SHELL_ALLOW_UNSAFE=1`)

Registers a single tool:

- **`shell_exec(command: str, base64: bool = False)`**: Executes `bash -c <command>` inside `working_directory` with the server's environment and no command/path validation or Landlock sandbox.
  - Set `base64=True` to receive stdout/stderr encoded as base64 (safe for binary output).
  - Still bounded by `max_execution_time`, `max_output_size` (independently caps stdout and stderr; cancels process on overflow), `working_directory`, and `run_as_user`.

## Secure Mode (`security.enabled: true`, default)

All paths are resolved against `working_directory` (symlinks followed; paths outside rejected).

### Always Registered (18 tools)
- **Filesystem & host (7):**
  - `read_file(path, offset=1, limit=0, tail=0)`
  - `list_dir(path=".", depth=1, include_hidden=False)`
  - `glob(pattern, path=".", newer_than="", max_results=500)`
  - `grep(pattern, path=".", glob="", ignore_case=False, context=0, files_only=False, count=False, max_results=200)`
  - `stat(path)`
  - `diff_files(path_a, path_b)`
  - `system_info()`
- **Git read-only (11):**
  - `git_status()`
  - `git_log(max_count=20, ref="HEAD", path="", author="", grep="", since="", until="", oneline=False, follow=False)`
  - `git_diff(ref="", ref_to="", staged=False, path="", stat_only=False, name_only=False)`
  - `git_show(ref="HEAD", path="", stat_only=False)`
  - `git_blame(path, ref="HEAD", line_start=0, line_end=0)`
  - `git_branches(all=False, merged=False)`
  - `git_tags(pattern="")`
  - `git_rev_parse(ref)`
  - `git_ls_files(path="", untracked=False)`
  - `git_stash_list()`
  - `git_remotes()`

### Opt-In Write Tools (`writes_enabled: true`, 10 tools)
Writes into `.git` or `.gitattributes` remain blocked by `resolveForWrite`.
- **Filesystem writes (5):** `write_file(path, content, append=False)`, `edit_file(path, old_string, new_string, replace_all=False)`, `mkdir(path)`, `move(from, to)`, `delete(path, recursive=False)`
- **Git writes (5):** `git_add(paths?, all=False)`, `git_commit(message, all=False)`, `git_switch(branch, create=False)`, `git_restore(paths, staged=False)`, `git_stash(action, message="")`

### Opt-In Scripts (`scripts` map non-empty, 1 tool)
- **`run_script(name)`**: Executes an operator-configured command slice by key; the client cannot append or alter arguments.
