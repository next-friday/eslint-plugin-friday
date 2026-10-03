# jsx-newline-between-elements

📝 Require empty lines between adjacent JSX elements, fragments, or expression containers when either is multi-line.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Behavior

This rule separates JSX siblings when either sibling spans multiple lines. The blank line makes the boundary between a larger block and nearby content easier to scan.

## Examples

### Reported

`<header>` spans multiple lines, so the adjacent paragraph needs a blank line before it:

```tsx
function AccountPanel() {
  return (
    <section>
      <header>
        <h1>Account</h1>
      </header>
      <p>Manage your profile.</p>
    </section>
  );
}
```

### Accepted

Add one empty line between those siblings:

```tsx
function AccountPanel() {
  return (
    <section>
      <header>
        <h1>Account</h1>
      </header>

      <p>Manage your profile.</p>
    </section>
  );
}
```

## Scope and autofix

The rule checks each JSX element and fragment. Among its children, whitespace-only JSX text is ignored. Non-whitespace JSX text remains a child and therefore separates JSX elements, fragments, and expression containers; the rule compares only adjacent significant children. It reports when either adjacent significant child spans multiple lines and there is no blank line between them.

For this rule, a child spans multiple lines when its start and end locations are on different source lines.

The fixer inserts one blank line after the earlier child.
