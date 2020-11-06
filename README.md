# cronist
Transform comment documentation into [ES modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules).

### Why?
cronist makes it easy to quickly hook up dynamic documentation into a documentation site. It also circumvents a problem with importing data as JSON files as described by this question on [stackoverflow](https://stackoverflow.com/questions/34944099/how-to-import-a-json-file-in-ecmascript-6).

Features:
  * Mdast parsing as the `mdast` key on each documentation item

Proof of concept: comments in [rubico source](https://github.com/a-synchronous/rubico) and documentation site [rubico.land](https://rubico.land/)

# Usage
Write comment documentation following a basic `@key #valid-markdown` schema.

```javascript
/**
 * @name tap
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var args ...any,
 *   tapper ...args=>Promise|any
 *
 * tap(tapper)(...args) -> Promise|args[0]
 * ```
 *
 * @description
 * Call a function with a value, returning the value. Promises created by the tapper are resolved before returning the value.
 *
 * ```javascript [playground]
 * pipe([
 *   tap(console.log),
 *   value => value + 'bar',
 *   tap(console.log),
 * ])('foo') // 'foo'
 *           // 'foobar'
 * ```
 */
const tap = ...
```

Use cronist to parse the file containing the above comment documentation into ES modules.

```sh
$ cronist file-that-had-the-above-tap.js
export default [
  {
    name: 'tap',
    synopsis: '```coffeescript [specscript]\n' +
      'var args ...any,\n' +
      '  tapper ...args=>Promise|any\n' +
      '\n' +
      'tap(tapper)(...args) -> Promise|args[0]\n' +
      '```',
    description: 'Call a function with a value, returning the value. Promises created by the tapper are resolved before returning the value.\n' +
      '\n' +
      '```javascript [playground]\n' +
      'pipe([\n' +
      '  tap(console.log),\n' +
      "  value => value + 'bar',\n" +
      '  tap(console.log),\n' +
      "])('foo') // 'foo'\n" +
      "          // 'foobar'\n" +
      '```',
    mdast: {
      name: {/* ... */},
      synopsis: {/* ... */},
      description: {/* ... */}
    }
  },
  ...
]
```

# Installation
with `npm`
```sh
npm i cronist
```

# TODO
 * support globbing
