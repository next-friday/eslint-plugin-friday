# Current State Authority Rules

Use the source order below for implementation decisions; inspect Git history to investigate prior behavior.

## Source of Truth

For implementation decisions, use this order of authority:

1. Explicit current user requirements
2. Applicable project instructions, including instructions scoped to the affected directory or workspace
3. Current working tree
4. Applicable tests, contracts, schemas, and configuration
5. Current runtime behavior and logs
6. Official upstream documentation
7. Git history as historical evidence only

## Repository and Workspace Scope

- Identify the affected application, package, service, or project before investigating.
- In a multi-project repository, read both repository-level guidance and the instructions and configuration that apply to the affected project.
- For changes crossing project boundaries, check each affected project's contract and its shared workspace configuration.

## Deleted and Reverted Code

- Treat code absent from the current working tree as removed. Reuse a deleted or reverted implementation only when the user explicitly requests that historical implementation.
- Treat code removed because it was buggy, incorrect, obsolete, rejected, or being rewritten as rejected; when restoration is requested, verify it against current requirements and resolve the reason it was removed.

## Git History Investigation

- Inspect Git history to identify when behavior changed, locate regression boundaries, understand why code changed or was removed, investigate previous bugs, discover rejected approaches, understand architectural decisions, or compare historical and current behavior.
- Use commands such as `git log`, `git show`, `git blame`, `git diff`, `git bisect`, `git log -S`, and `git log -G` for investigation.
- Establish the proven cause before making the smallest correct change against the current codebase.
- Pair historical findings with the current working tree and identify the revision consulted; check the target revision explicitly if `HEAD` may have moved.

## Rewrite Process

When rewriting functionality:

1. Inspect the current working tree.
2. Establish the current requirements and contracts.
3. Inspect the tests, contracts, and configuration that apply to the affected project.
4. Reproduce or verify the current problem when applicable.
5. Implement against the current state; use historical implementation only to understand what was attempted and why it changed or failed.
6. Run the applicable checks required by the task or established project workflow, then report their results and any checks unavailable or not run.

## Conflict Resolution

- When repository-level and project-level conventions differ, apply the more specific convention within its stated scope and follow the workspace's documented composition rules.
