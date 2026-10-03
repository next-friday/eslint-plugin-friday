# Create GitHub Pull Request

## Purpose

Prepare or create reviewable GitHub pull requests from a confirmed repository, branch, base, and verified committed diff.

## When to use

Use this skill when the user asks to draft, prepare, open, or create a GitHub pull request for a repository or branch.

## Behavior

The skill resolves the base repository and branch, distinguishes committed changes from staged, unstaged, and untracked work, discovers applicable repository guidance and PR templates, preserves the selected template as an output contract, and reports verification only from checks that were actually requested and run.

## Safety and write boundary

Drafting is read-only. PR creation occurs only when explicitly requested and requires a clean worktree with all intended changes committed. The skill never stages, commits, amends, rebases, discards, or force-pushes changes. A push is limited to the verified head remote when required for an explicitly requested PR creation.

## Files

- `SKILL.md` — authoritative agent workflow and pull-request contract.
- `tests/pressure-scenarios.md` — manual regression scenarios for target resolution, change accounting, templates, activation, and portability.
