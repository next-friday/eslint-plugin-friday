# Pull Request Portability Scenarios

Manual regression cases for target resolution, complete change accounting, repository-specific policy, and skill activation. Expected behavior is stated so reviewers can evaluate a fresh run consistently.

## 1. Custom target remote and repository policy

**Setup:** The GitHub repository uses a remote named `upstream`, a nonstandard default branch, no Changesets, and no documented check command. The user requests a draft but does not request verification.

**Expected:** The agent resolves the repository and base from explicit target or GitHub metadata, does not assume `origin` or `.changeset/`, does not run checks, and reports checks as not requested.

## 2. Dirty worktree in draft and creation modes

**Setup:** The branch has committed changes plus staged, unstaged, and untracked files.

**Draft prompt:** “Prepare a PR draft.”

**Create prompt:** “Open a PR.”

**Expected:** For the draft, the agent reports the committed diff and each local change state separately, and asks before including local changes. For creation, it stops before push or PR creation and reports the paths. It does not stage, commit, amend, rebase, or discard anything.

## 3. Template selection is ambiguous

**Setup:** The repository has multiple PR templates in supported locations, with no repository rule naming a default.

**Expected:** The agent asks which template to use and does not combine the templates.

## 4. Fork head and upstream base

**Setup:** The branch is checked out in a fork with an upstream remote, and the user names the upstream repository as the PR target.

**Expected:** The agent resolves the upstream as the base and the fork as the head, pushes only to the verified fork remote when needed, and creates the PR with that exact base/head pair.

## 5. Verification request without an exact command

**Prompt:** “Prepare a PR and verify it.”

**Expected:** The agent discovers checks from the target repository's instructions and configuration, runs applicable checks, and reports actual commands and results. If no check can be identified, it reports verification as unavailable.

## 6. Activation boundary

**Positive prompt:** “Open a pull request for this branch.”

**Expected:** The PR workflow activates.

**Negative prompt:** “What changed in this branch?”

**Expected:** The agent summarizes the branch without drafting or opening a PR unless asked.

## 7. Markdown PR template is a structural contract

**Setup:** The selected PR template contains fixed instructions, HTML comments, required and optional sections, and checklist items. The committed diff provides content for only some response locations.

**Prompt:** “Prepare the PR.”

**Expected:** The draft preserves every heading, section, fixed literal, HTML comment, checklist item, and their order. It writes only inside allowed response locations, keeps optional sections represented, and does not add, remove, rename, merge, split, or reorder template structure.

## 8. Default-branch PR template differs from the checkout

**Setup:** The local checkout contains an edited PR template that differs from the template currently visible on the base repository's GitHub default branch. The user has not asked to target unpublished local template changes.

**Prompt:** “Prepare a PR for this branch.”

**Expected:** The agent uses the PR template from the confirmed base repository default branch as the authoritative contract and does not silently use the divergent local copy.

## 9. Repository title policy cannot replace the required shape

**Setup:** Repository guidance adds PR title constraints but also declares a convention that would omit or replace part of `<type>(<scope>): <subject>`.

**Prompt:** “Prepare the PR.”

**Expected:** The agent always emits `<type>(<scope>): <subject>`. It applies compatible repository constraints to the type, scope, or subject, but does not omit the mandatory scope or replace the required title shape.

## 10. Independent models preserve the same PR shape

**Setup:** Multiple fresh agent runs receive the same base repository, selected PR template, and verified committed diff.

**Prompt:** “Prepare the PR.”

**Expected:** Every run produces the same ordered template structure and field coverage. Wording may vary only inside allowed response locations; no run may omit optional structure or introduce undeclared sections or checklist items.

## 11. Supporting files do not redefine the PR title

**Setup:** A bug fix changes an API implementation plus supporting authentication code, tests, fixtures, and configuration. Every changed path exists to deliver and verify the same API behavior change.

**Prompt:** “Prepare the PR.”

**Expected:** The agent derives one title from the primary logical change, keeps exactly one mandatory scope for the primary subsystem or logical owner, and does not concatenate scopes from the supporting files or copy individual commit-message scopes into the PR title.

## 12. Independent changes block umbrella titles

**Setup:** The committed diff contains an API bug fix plus unrelated documentation cleanup and unrelated lint configuration cleanup.

**Prompt:** “Prepare the PR.”

**Expected:** The agent reports that the branch contains multiple independent logical changes and stops title drafting. It does not invent an umbrella subject or compound scope to cover the unrelated changes.
