# AI Agent Repository Context

Internal reference documents for AI coding agents working in this repository. Follow [`AGENTS.md`](../../AGENTS.md) for binding instructions. These files provide repository context and do not replace the package documentation.

| Branch trigger                              | Document                                                                                               | Scope                                              |
| :------------------------------------------ | :----------------------------------------------------------------------------------------------------- | :------------------------------------------------- |
| Purpose and package boundary                | [`overview.md`](overview.md)                                                                           | What this plugin contains and its package contract |
| Source layout, exports, build, verification | [`architecture.md`](architecture.md)                                                                   | Package topology and distribution                  |
| Rule-contract vocabulary                    | [`../../CONTEXT.md`](../../CONTEXT.md)                                                                 | Local rule-contract definitions                    |
| Standalone package boundary                 | [`../adr/0001-standalone-eslint-plugin-boundary.md`](../adr/0001-standalone-eslint-plugin-boundary.md) | Why this package documents only contracts it owns  |
| Public rule behavior                        | [`../../docs/rules/`](../../docs/rules/)                                                               | Rule behavior documentation                        |

Related documentation:

- Package and contributor documentation: [`../../README.md`](../../README.md), [`../../CONTRIBUTING.md`](../../CONTRIBUTING.md)
- Package usage and compatibility: [README](../../README.md)
- Repository invariants: [`.claude/rules/`](../../.claude/rules/)
- Agent authority and workflow: [`AGENTS.md`](../../AGENTS.md)
- Contribution and release flow: [`CONTRIBUTING.md`](../../CONTRIBUTING.md), [`.changeset/README.md`](../../.changeset/README.md)
- Security and conduct: [`SECURITY.md`](../../SECURITY.md), [`CODE_OF_CONDUCT.md`](../../CODE_OF_CONDUCT.md)
