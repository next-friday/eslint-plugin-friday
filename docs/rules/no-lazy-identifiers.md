# no-lazy-identifiers

📝 Disallow lazy placeholder identifiers such as repeated characters and keyboard-row runs.

<!-- end auto-generated rule header -->

## Options

<!-- begin auto-generated rule options list -->

| Name    | Description                                        | Type     | Default |
| :------ | :------------------------------------------------- | :------- | :------ |
| `allow` | Identifier names explicitly exempt from this rule. | String[] | `[]`    |

<!-- end auto-generated rule options list -->

## Behavior

This rule catches placeholder-style names at their definitions. It targets repeated-character runs and keyboard-row sequences that are unlikely to describe a value's purpose.

## Examples

### Reported

`xxx` repeats a character three times, and `asdf` follows four keys on a QWERTY row:

```ts
const xxx = "temporary";

function resolve(asdf: string) {
  return asdf;
}
```

### Accepted

Use names that tell readers what the value represents:

```ts
const retryCount = 3;

function resolveRequest(requestId: string) {
  return requestId;
}
```

## Scope and options

The rule checks definitions of variables, parameters, function and class names, catch bindings, and TypeScript type names. It does not check every identifier occurrence or property name.

An identifier is reported when its JavaScript string length is at least three and it contains the same character three times consecutively, or when one of its words is a keyboard-row run of at least four characters. For keyboard-row detection, the identifier is split into words at case, acronym, digit, and punctuation boundaries. A word must itself be a contiguous run on a QWERTY letter row or the `1234567890` number row, in either direction; a keyboard sequence embedded inside a longer word is not reported.

Names beginning with `_` are ignored. The `allow` option is an exact-name allowlist and defaults to an empty list. For example, `_xxx` is ignored, and a name added to `allow` is exempted wherever that exact identifier is defined.
