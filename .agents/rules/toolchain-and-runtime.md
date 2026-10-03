# Toolchain and Runtime Rules

Keep automation and implementation predictable within the project's declared toolchain and supported environments.

## Hook and Execution Order

- Run state-changing tools in a deliberate order and verify results with the project's applicable checks.
- Keep local hooks fast and reliable. Run remote or network-dependent checks in the repository's automation pipeline when one exists, unless the project requires them locally.
- Use automation compatible with the project's supported environments; document required platform-specific behavior.

## Toolchain and Runner Parity

- Use the project's declared runtime, build tools, and locally available runners; follow its package-manager conventions. In a multi-language workspace, use the toolchain belonging to the changed component.
- Prefer direct, discoverable project commands; retain wrappers when they provide needed workspace selection, environment setup, or other behavior.

## System and Algorithm Assumptions

- Derive parsing and validation from documented formats and supported platforms instead of incidental assumptions such as fixed identifier lengths, operating systems, or working directories.
