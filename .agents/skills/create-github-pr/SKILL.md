---
name: create-github-pr
description: Use when the user asks to draft or create a GitHub pull request for a repository or branch, including preparing a PR or opening one.
license: MIT
---

# Create GitHub Pull Request

Prepare a reviewable pull request from the confirmed target repository and the complete intended branch changes.

## 1. Resolve the target and inspect changes

1. Resolve the base repository from an explicit GitHub URL or `[HOST/]OWNER/REPO` first. Otherwise use the current checkout's repository from `gh repo view --json nameWithOwner,url`, retaining the host for GitHub Enterprise, and inspect branch upstream/remotes when a fork may be involved. Ask if the intended base repository is ambiguous. Never assume a remote is named `origin`.
2. Resolve the base branch from an explicit user choice, then the current branch's `gh-merge-base` configuration, then the base repository's default branch from GitHub metadata. Match it to an available local or remote-tracking ref. If the base ref is unavailable, ask before fetching or choosing a different ref.
3. Inspect the branch and all local change states:

   ```sh
   git status --short --branch
   git log "<base-ref>"...HEAD --oneline
   git diff "<base-ref>"...HEAD
   git diff --cached
   git diff
   git ls-files --others --exclude-standard
   ```

4. For a draft, base the proposed PR on the committed branch diff. Report staged, unstaged, and untracked paths separately; inspect contents of untracked files only when the user identifies them as intended, and ask before including any local changes. Never claim the draft covers uncommitted changes that were not inspected.
5. For creation, continue only when every intended change is committed and the worktree has no staged, unstaged, or untracked changes. If it is dirty, show the affected paths and stop before pushing or creating; the user can commit them or authorize a specific action. Never stage, commit, amend, rebase, discard, or force-push changes on the user's behalf.

_Completion criterion_: The target repository, base ref, committed diff, and intended-change boundary are verified. Creation also requires a clean worktree.

## 2. Discover repository policy and checks

1. Read only present instructions that apply to the target and changed paths, including `AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING.md`, and release guidance. Inspect repository instructions at the root and along affected paths.
2. Follow a release-note or versioning mechanism only when repository guidance or configuration establishes it. For example, require a Changesets entry only when the target repository uses and documents Changesets; an absent `.changeset/` directory is not itself a failure.
3. Run checks only when the user requests verification. When requested, discover commands from applicable repository guidance and configuration, then report each command and its actual result. If no applicable command can be identified, say verification is unavailable. When not requested, report checks as not requested; do not assume local hooks or CI have run.

_Completion criterion_: Applicable repository policy is identified; any release metadata follows that policy; check status is recorded as actual results, unavailable, or not requested.

## 3. Draft the title and body

1. Resolve the base repository's default branch from GitHub metadata and treat the PR template visible there as the authoritative template contract. Find the template in GitHub-supported locations: the repository root, `docs/`, or `.github/`, including `pull_request_template.md` and `PULL_REQUEST_TEMPLATE/` directories with supported `.md` or `.txt` files. Do not substitute a divergent local template unless the user explicitly targets that unpublished state. Follow an explicit repository instruction. If several templates could apply and no default is declared, ask which one to use; never combine them. See [GitHub PR template guidance](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/creating-a-pull-request-template-for-your-repository).
2. If a template applies, treat it as an output contract. Preserve every heading, section, prompt, checklist item, fixed literal, HTML comment, and their order. Do not add, remove, rename, reorder, merge, or split template structure. Keep optional sections represented and leave response space empty when the template permits and no verified content exists. Mark checkboxes only when evidence supports them. Never invent `N/A`, placeholder facts, extra sections, or issue links.
3. If no template applies, use concise sections for Summary, Changes, and Verification.
4. Every PR title must use the exact format `<type>(<scope>): <subject>`. Repository guidance and templates may further constrain the allowed type, scope, or subject, but they must not replace or omit this required title shape. Derive the title from the single primary logical change represented by the verified committed diff, not from the changed-file inventory or individual commit messages. Treat tests, fixtures, generated files, configuration, and other supporting edits as implementation footprint when they exist only to support that same logical change. If the committed diff contains independent changes that cannot truthfully share one scope and one subject, report the PR as containing multiple logical changes and stop title drafting instead of inventing an umbrella title or compound scope:
   - Use one lowercase type from `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, or `test`.
   - Include exactly one non-empty, lowercase scope. The scope is mandatory and must identify the primary affected subsystem or logical ownership area; do not derive it by concatenating changed paths, supporting files, or commit-message scopes.
   - Write a non-empty subject of at most 50 characters, counting only the text after `: `. Do not end the subject with `!`.
   - Choose the type and subject from the primary logical change. For example: `feat(auth): add passwordless sign-in`.
5. Summarize only the verified committed diff and why it changed, writing inside the response locations allowed by the template. Link issues only with verified numbers. State checks as requested/not requested, unavailable, or with actual results.
6. Before presenting or creating the PR, validate the draft against the selected template contract. The ordered structural skeleton must match exactly; any added, missing, renamed, merged, split, or reordered structural element is a blocker and must be corrected before continuing.

_Completion criterion_: Template conformance passes when a template exists; the committed diff represents one primary logical change that can be named truthfully; the title uses the required `<type>(<scope>): <subject>` shape and satisfies any additional repository/template constraints; and the body describes the verified committed diff without changing the selected template structure.

## 4. Draft or create

- **Draft-only:** For requests to prepare or review a PR, present the title, body, and check status. Do not push or create.
- **Create:** Run `gh pr create` only when the user explicitly asks to open or create the PR and the worktree is clean. Immediately before creation, re-read the authoritative selected PR template and rerun template-conformance validation; if the template changed, update the draft and validate again before any write. Resolve the base repository separately from the head repository: a verified fork may be the head while its upstream is the base. Verify the branch's configured upstream or another explicitly selected head remote; if the branch is unpushed, push only to that verified remote. Stop if the intended head remote, base, or required access is unclear. Pass the confirmed base repository and branch, reviewed title, exact reviewed body, and verified head owner/branch (using `--head` when it differs from the base). Do not allow an interactive CLI prompt to create a fork the user did not request. If GitHub CLI cannot represent the verified head, stop and provide the web submission route. Add draft mode, reviewers, labels, milestones, or projects only when requested and verified.
- On push or CLI failure, report the error and preserve the complete draft for manual submission.

_Completion criterion_: Return the live PR URL, or return the complete draft and exact blocker before push or creation.
