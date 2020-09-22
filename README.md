# cronist
Turn comments into JSON

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
    "name": "tap",
    "synopsis": "tap(\n  tapper value=>Promise|any,\n)(value any) -> value\n",
    "description": "Call a function with a value..."
    "description_mdast": {
      "type": "root",
      "children": [{/* ... */}, {/* ... */}],
      "position": {
        "start": {
          "line": 1,
          "column": 1,
          "offset": 0
        },
        "end": {
          "line": 11,
          "column": 1,
          "offset": 196
        }
      }
    }
  },
```
