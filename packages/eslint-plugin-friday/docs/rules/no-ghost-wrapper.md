# no-ghost-wrapper

💼 This rule is enabled in the ⚛️ `react/recommended` config.

<!-- end auto-generated rule header -->

Disallow bare `<div>` and `<span>` elements that carry no meaningful attributes, known as Divitis or ghost wrappers.

## Rationale

A `<div>` or `<span>` with no attributes adds a DOM node that does nothing for layout, semantics, or behavior. Replacing it with a Fragment, a semantic element, or giving it a real attribute keeps the markup lean and accessible.

## Examples

❌ Incorrect

```tsx
<div>{children}</div>
<span>text</span>
```

✅ Correct

```tsx
<>{children}</>
<section>{children}</section>
<div className="container">{children}</div>
```

Only `<div>` and `<span>` are checked. Any attribute makes the element meaningful — except `key`, which alone does not count, since it serves React's reconciler rather than the rendered element.

## Options

This rule has no options.

## When not to use

Disable it if your styling approach relies on otherwise-bare wrapper elements that the rule cannot recognize.
