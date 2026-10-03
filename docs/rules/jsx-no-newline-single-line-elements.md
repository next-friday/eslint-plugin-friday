# jsx-no-newline-single-line-elements

📝 Disallow empty lines between adjacent single-line JSX elements or fragments.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Behavior

This rule keeps adjacent single-line JSX siblings compact. It reports an empty line only when both neighboring elements or fragments each fit on one line.

## Examples

### Reported

Both `<label>` and `<input>` occupy one line, so the empty line between them is unnecessary:

```tsx
function EmailField() {
  return (
    <div>
      <label htmlFor="email">Email</label>

      <input id="email" type="email" />
    </div>
  );
}
```

### Accepted

Keep the siblings on consecutive lines:

```tsx
function EmailField() {
  return (
    <div>
      <label htmlFor="email">Email</label>
      <input id="email" type="email" />
    </div>
  );
}
```

## Scope and autofix

The rule checks each JSX element and fragment. Non-whitespace JSX text remains a child and therefore separates the elements; whitespace-only JSX text is ignored. JSX expression containers, including comments written as JSX expressions, also separate elements and are not themselves reported by this rule.

For this rule, a sibling is single-line when its start and end locations are on the same source line. The fixer replaces the gap with one line break and the next element's indentation. Multi-line siblings are outside this rule's report condition.
