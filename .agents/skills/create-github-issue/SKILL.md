---
name: create-github-issue
description: Use when the user asks to draft or create a GitHub issue for a repository, including reporting a bug, requesting a feature, or filing an issue.
license: MIT
---

# Create GitHub Issue

Draft and file issues against the confirmed GitHub repository, following its applicable reporting policy and template.

## 1. Resolve the repository and route

1. Resolve the target from an explicit GitHub URL or `[HOST/]OWNER/REPO` first. Otherwise use the current checkout's repository from `gh repo view --json nameWithOwner,url`, retaining the host for GitHub Enterprise; if unavailable, inspect all Git remotes and use one only when it identifies a single unambiguous GitHub repository. Never assume the remote is named `origin`. Ask when the target cannot be confirmed.
2. Read the target repository's applicable instructions and reporting guidance when present, including root or path-scoped `AGENTS.md` / `CLAUDE.md`, `CONTRIBUTING.md`, `SECURITY.md`, `SUPPORT.md`, and linked reporting documents. Check supported root, `docs/`, and `.github/` locations. Treat absent files as absent; do not make their presence a prerequisite.
3. Resolve the repository's default branch from GitHub metadata and treat the issue template visible there as the authoritative template contract. Find templates in GitHub-supported locations: the repository root, `docs/`, or `.github/`, including `.github/ISSUE_TEMPLATE/` and Markdown (`.md`) or YAML (`.yml`) issue forms. Do not substitute a divergent local template unless the user explicitly targets that unpublished state. GitHub's normal template chooser uses `.github/ISSUE_TEMPLATE/`; templates in root or `docs/ISSUE_TEMPLATE/` may be selected through a template URL. Follow an explicit repository instruction. If more than one template could apply and no default is declared, ask which one to use. Use an organization default community-health template only when GitHub makes it visible and applicable to this repository. See [GitHub issue template guidance](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/about-issue-and-pull-request-templates) and [issue creation](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-an-issue).
4. Classify the request:
   - **Bug / feature:** use the matching template, or a concise Problem, Evidence, Expected Behavior structure when none exists.
   - **Security:** use a verified private vulnerability-reporting route from the repository policy or GitHub Security page. Never include vulnerability details in a public issue. If no private route is available, stop the vulnerability report and tell the user GitHub's fallback is a separate public issue asking only for a security contact; prepare or create that contact-only issue only if the user explicitly chooses it. See [GitHub's private reporting guidance](https://docs.github.com/en/code-security/how-tos/report-and-fix-vulnerabilities/report-privately).
   - **Support / discussion:** use the repository's designated support channel. If none is documented, stop and ask the user where to route it.
5. If the request does not clearly map to one route or template, ask one focused question before drafting.

_Completion criterion_: The GitHub repository is confirmed and the request has a valid route: a selected issue template or ordinary-issue fallback, a verified private security route, or a documented support destination. If no safe route exists, stop with the missing information identified.

## 2. Draft

1. Treat the selected template as an output contract, not as writing guidance. Before drafting, derive its ordered structure and allowed response slots.
   - **Markdown template:** preserve every heading, section, prompt, checklist item, fixed literal, HTML comment, and their order. Do not add, remove, rename, reorder, merge, or split template structure. Write only inside response locations the template makes available.
   - **YAML issue form:** preserve every body item and field in declared order. Use each declared `id`, field type, label, option, and validation as the schema. Required fields must have verified responses. Optional fields remain part of the form and may be left empty when allowed. Choose only declared options and mark checkboxes only when evidence supports them.
   - Never invent `N/A`, placeholder facts, extra sections, or undeclared options. If a required response cannot be established, stop and ask only for that missing required information.
   - If GitHub CLI cannot faithfully represent a YAML issue form, prepare the exact field values for the repository's web form instead of flattening, omitting, or rewriting the form.
2. Determine the title from repository policy and the selected template before applying a fallback convention. Preserve any declared title prefix or title rule. Only when neither defines a convention, format the title as `<type>(<scope>): <subject>`:
   - Use one lowercase type from `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, or `test`.
   - Include a non-empty, lowercase scope.
   - Write a non-empty subject of at most 50 characters, counting only the text after `: `. Do not end the subject with `!`.
   - Choose the type, scope, and subject from the verified issue request. For example: `fix(api): reject expired sessions`.
3. Use only verified evidence from repository inspection, command output, or user-provided traces. Do not infer facts merely to fill a field.
4. Remove credentials, tokens, personal identifiers, private URLs, and proprietary source snippets only from response content. Do not delete or reshape template structure while sanitizing.
5. Before presenting or creating the issue, validate the draft against the selected template contract field by field. For Markdown, the ordered structural skeleton must match exactly. For YAML issue forms, every declared field must be accounted for, every required field must be complete, and every choice must be declared by the form. Any structural mismatch is a blocker; correct it before continuing.

_Completion criterion_: Template conformance passes; the title follows repository/template policy or the fallback convention; all required responses are verified; optional fields remain represented as the template defines them; and sensitive material is removed without changing template structure.

## 3. Draft or create

- **Draft-only:** For requests to prepare, review, or draft, show the final title and body and identify the template or fallback used. Do not run a creation command.
- **Create:** Run `gh issue create` only when the user explicitly asks to create or submit. Immediately before creation, re-read the authoritative selected template and rerun template-conformance validation; if the template changed, update the draft and validate again before any write. Pass the confirmed repository, reviewed title, and exact reviewed body. Add labels, assignees, milestones, or projects only when requested and verified to exist. For a web-only issue form, provide its submission link and completed field values instead of creating a malformed issue.
- On command failure, report the error and keep the complete draft available for manual submission.

_Completion criterion_: Return the created issue URL, or return the complete draft and the exact blocker to submission.
