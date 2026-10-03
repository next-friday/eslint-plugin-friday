# Diagnostics and Error Handling Rules

Resolve diagnostics and runtime failures at their root cause using the affected language and toolchain. Preserve useful signals instead of hiding them with bypasses or unrelated configuration changes.

## Type and Input Validation

- In typed languages, use standard type narrowing and validation mechanisms to make assumptions explicit; validate external input at runtime with the project's established approach.
- For missing third-party types, annotations, or schemas, use authoritative upstream definitions or a narrow local definition or adapter in the established location.

## Linter Resolution

- Refactor code to satisfy diagnostic invariants at their source.
- Resolve implementation defects directly; keep bypass directives and rule overrides limited to documented, necessary cases.
- Report unresolved conflicts — type and third-party declaration conflicts, or rule and configuration defects — before proposing workarounds.

## Error Semantics and Diagnostics

- Preserve runtime failure visibility by surfacing errors at the responsible caller or process boundary with useful diagnostic context.
- Handle errors when adding context, recovering definitively, or translating them at an application or service boundary; remove empty catches and concealing fallback values.
- Retain root causes across layers using the language's standard error or exception mechanisms.
