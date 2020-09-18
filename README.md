# cronist
Inline documentation parser

Turn comments that start with `/**` and keyed by `@property`

```javascript
/**
 * @name tap
 *
 * @synopsis
 * tap(
 *   tapper value=>Promise|any,
 * )(value any) -> value
 *
 * @description
 * Call a function with a value, returning the value.
 *
 * ```javascript [playground]
 * pipe([
 *   tap(console.log),
 *   value => value + 'bar'
 *   tap(console.log),
 * ])('foo') // 'foo'
 *           // 'foobar'
 * ```
 */
const tap = ...
```

into these objects

```javascript
  {
    name: 'tap',
    synopsis: 'tap(\n  tapper value=>Promise|any,\n)(value any) -> value\n',
    description: 'Call a function with a value, returning the value.\n' +
      '\n' +
      '```javascript [playground]\n' +
      'pipe([\n' +
      '  tap(console.log),\n' +
      "  value => value + 'bar'\n" +
      '  tap(console.log),\n' +
      "])('foo') // 'foo'\n" +
      "          // 'foobar'\n" +
      '```\n'
  },
```

into HTML

```html
todo
```
