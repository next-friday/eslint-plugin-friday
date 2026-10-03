# Single Author Style Rules

Treat each cohesive application, package, or component as if one careful engineer owns it. Keep conventions consistent within that boundary while respecting intentional differences in language, runtime, and framework across the repository.

## Sibling Precedent

- Match representative siblings in the same category and owning project before deciding layout, naming, exports, helper placement, composition, error handling, or abstraction level.
- Default to the language and ecosystem's standard idioms when no applicable local pattern exists.
- Explain the chosen convention when a conflicting pattern affects the design.

## Structural Symmetry and Cohesion

- Keep declarations and implementation sections predictable among siblings with the same responsibility, following local structure where it exists.
- Keep execution flow collocated and direct; introduce separate files or helpers only when multiple callers share them.

## Declarative Naming and Types

- Use one term for one concept within the owning project across filenames, symbols, configuration, tests, and documentation.
- Name parallel symbols with matching grammatical structure that describes the domain contract.
- Keep types, data models, and function signatures concrete and readable where the language provides them; follow that language's established idioms.
- Write comments only to capture non-obvious domain intent, technical constraints, or upstream workarounds; let identifiers explain mechanics.

## Scoped Changes

- Keep edits within the requested component, directly affected call sites, and necessary workspace metadata.
- Use the owning project's configured linters and formatters as the source of truth for code style.
- Make cross-project or repository-wide convention changes explicit in the task scope.
