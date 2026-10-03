# Deterministic Testing Rules

Keep tests as small, deterministic protections for observable contracts. A source change alone is not evidence that another test is needed.

## Test Admission

- Name the contract and the distinct defect a proposed test can detect before writing it.
- Admit tests only for externally observable behavior, public contracts, demonstrated regressions, non-trivial invariants, meaningful failure modes, or an explicit repository verification requirement.
- Choose the narrowest existing test layer that owns the contract, such as unit, integration, component, or end-to-end coverage.
- Verify behavior-changing configuration through its effective result or an observable build or runtime effect, rather than asserting configuration object properties alone.
- For changed configuration, existing and new coverage together must distinguish its public shape and at least one observable behavior; add nothing when current cases already detect both.
- Give each test one distinct contract and defect to detect; avoid duplicating assertions across test layers.
- Reject tests that restate static guarantees, assert implementation details, exercise impossible states, or increase coverage without increasing defect detection.
- Treat coverage percentage as a measurement, not a reason to add tests.
- Leave tests unchanged when no proposed case survives admission.

## Coverage Ownership

- Search existing coverage in the project before adding a case. Extend the test file that already owns the contract whenever one exists.
- Create a test file only when the contract has no owner or requires a materially different execution harness or fixture lifecycle. File length, naming symmetry, and case count do not establish a boundary.
- Follow the nearest applicable directory and naming pattern; never create files, directories, helpers, or fixtures solely to mirror sibling structure.
- Keep setup local until multiple tests share live runtime logic, then extract one canonical helper.

## Case Budget and Pruning

- Use the minimum distinguishing cases needed to protect the admitted contract.
- Keep a case only when it detects a defect the remaining cases would miss; remove cases already covered elsewhere.
- Represent data-only variants in one parameterized test rather than parallel cases or files.
- Map every added or modified case to its admitted contract and defect.

## Canonical Test Idioms and Fixtures

- Use the test framework's standard assertion patterns rather than inventing bespoke helpers, summary mappers, or diagnostic formatters.
- Keep test setup and helpers lean; do not build a custom test framework on top of the repository's existing tools.
- Use an inline source snippet unless filesystem paths, module resolution, or compiler services are part of the contract.
- Keep required fixtures declarative and read-only, following the repository's existing convention.
- Use concrete filesystem fixtures when filesystem behavior, module resolution, or compiler integration is part of the contract.
- Prefer maintained capabilities of the existing test tools over temporary filesystem generation or bespoke mock harnesses.

## Execution Scope

- When test execution is requested, run the narrowest owning test file or filter using the project's established command.
- A passing result remains authoritative until relevant source, configuration, helper, or fixture input changes.
- Reserve the full suite for one final run when explicitly requested.
- Run cross-project or end-to-end checks when the changed contract crosses a project boundary or user-visible flow; run coverage only when explicitly requested.
