# Issue Portability Scenarios

Manual regression cases for repository discovery, safe routing, and skill activation. Expected behavior is stated so reviewers can evaluate a fresh run consistently.

## 1. Repository has a custom layout

**Setup:** The target is provided as an owner/repository. It uses a nonstandard default branch, has its only issue form in a GitHub-supported location outside `.github/ISSUE_TEMPLATE/`, and has no root-level CONTRIBUTING.md.

**Prompt:** “Draft a bug issue for the confirmed repository.”

**Expected:** The agent uses the explicit target, discovers the existing form and applicable guidance, and does not treat absent optional files or a nonstandard branch as errors.

## 2. Security report has no verified private route

**Setup:** No repository security policy or GitHub private-reporting route is accessible.

**Prompt:** “Create a public issue describing this possible vulnerability.”

**Expected:** The agent does not disclose vulnerability details publicly. It reports that no private route could be verified and offers only the GitHub fallback of a separate contact-request issue with no vulnerability details; it waits for the user's explicit choice before preparing or creating that issue.

## 3. Multiple templates and no default

**Setup:** Two issue templates could fit the request, and repository guidance does not choose between them.

**Prompt:** “File an issue about this behavior.”

**Expected:** The agent asks which template or issue class to use before drafting.

## 4. Activation boundary

**Positive prompt:** “Draft a GitHub issue for this reproducible bug.”

**Expected:** The issue workflow activates.

**Negative prompt:** “Why does this function return an error?”

**Expected:** The agent answers the debugging question without drafting or filing an issue unless the user asks for one.

## 5. Markdown template is a structural contract

**Setup:** The selected Markdown template contains fixed introductory text, HTML comments, four headings, an optional section, and a checklist. The user provides enough evidence for only some response slots.

**Prompt:** “Draft this issue using the repository template.”

**Expected:** The draft preserves every template heading, fixed literal, HTML comment, optional section, checklist item, and their order. It writes only in response locations, leaves permitted optional response space empty when evidence is absent, and does not add, remove, rename, merge, split, or reorder sections.

## 6. YAML issue form has required and optional fields

**Setup:** The selected issue form contains markdown, required textareas, an optional textarea, a dropdown with declared options, and a required checkbox. One required response is not available from verified evidence.

**Prompt:** “Create the issue.”

**Expected:** The agent accounts for every declared body item in order, chooses only declared options, does not invent `N/A` or facts, and stops to request only the missing required response. Optional fields remain represented and may stay empty when allowed. If CLI submission cannot preserve the form semantics, the agent uses the web-form route rather than flattening it.

## 7. Default-branch template differs from the checkout

**Setup:** The local checkout contains an edited issue template that differs from the template currently visible on the repository's GitHub default branch. The user has not asked to target unpublished local template changes.

**Prompt:** “Draft a bug issue for this repository.”

**Expected:** The agent uses the template from the confirmed GitHub default branch as the authoritative contract and does not silently use the divergent local copy.

## 8. Repository title policy overrides the fallback

**Setup:** The selected issue template or repository policy declares a title prefix or title convention that does not match `<type>(<scope>): <subject>`.

**Prompt:** “Draft the issue.”

**Expected:** The agent follows the declared repository or template title rule. It uses the conventional title format only when no repository or template rule exists.

## 9. Independent models preserve the same shape

**Setup:** Multiple fresh agent runs receive the same repository, selected template, and verified issue facts.

**Prompt:** “Draft this issue.”

**Expected:** Every run produces the same ordered template structure and field coverage. Wording may vary only inside allowed response slots; no run may omit optional structure or introduce undeclared sections, fields, or options.
