# cronist
![cronist](https://rubico.land/assets/cronist-logo-3.jpg)

Transform comment documentation into [JSON](https://www.json.org/json-en.html) or [ES modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules).

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
