# cronist
Turn comments into JavaScript

### Example
Turn these

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

into these

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
      '```\n',
    description_mdast: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'Call a function with a value, returning the value.',
              position: Position {
                start: { line: 1, column: 1, offset: 0 },
                end: { line: 1, column: 51, offset: 50 },
                indent: []
              }
            }
          ],
          position: Position {
            start: { line: 1, column: 1, offset: 0 },
            end: { line: 1, column: 51, offset: 50 },
            indent: []
          }
        },
        {
          type: 'code',
          lang: 'javascript',
          meta: '[playground]',
          value: 'pipe([\n' +
            '  tap(console.log),\n' +
            "  value => value + 'bar'\n" +
            '  tap(console.log),\n' +
            "])('foo') // 'foo'\n" +
            "          // 'foobar'",
          position: Position {
            start: { line: 3, column: 1, offset: 52 },
            end: { line: 10, column: 4, offset: 195 },
            indent: [
              1, 1, 1, 1,
              1, 1, 1
            ]
          }
        }
      ],
      position: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: 11, column: 1, offset: 196 }
      }
    }
  },
```
