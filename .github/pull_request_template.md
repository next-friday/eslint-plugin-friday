<!-- Use `<type>(<scope>): <subject>` for the pull request title. Repository workflows validate this format. -->

## Description

<!-- Describe what changed and why. -->

## Related issue

<!-- Link a related issue (for example, `Closes #123`) or write `None`. -->

## Type of change

<!-- Select the primary change type. -->

- [ ] `fix`: Backward-compatible bug fix or rule correction
- [ ] `feat`: New backward-compatible rule or plugin capability
- [ ] `docs`: Documentation
- [ ] `refactor`: Internal refactor with no diagnostic change
- [ ] `chore`: Maintenance, CI, or dependency update

<!-- For a breaking public rule or package API change, use a valid type above and record a major release in the changeset. -->

## Contributor checklist

- [ ] The change follows repository guidelines and preserves rule and package boundaries.
- [ ] Tests cover any changed observable contract.
- [ ] Generated rule documentation is current when rule metadata changes.

## Verification

<!-- List the checks you ran and their results. Note checks left to Git hooks or CI. -->

## Release intent and changeset

<!-- Select one option. -->

- [ ] A package release is required, and a pending or new `.changeset/*.md` entry covers it.
- [ ] The package change has no release impact, so no changeset is required.
- [ ] Only documentation, CI, or repository tooling changed, so no changeset is required.
