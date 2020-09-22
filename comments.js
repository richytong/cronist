/**
 * @name pipe
 *
 * @synopsis
 * pipe(
 *   funcs Array<any=>Promise|any>,
 * )(value any) -> Promise|any
 *
 * Reducer = (any, any)=>Promise|any
 *
 * pipe(
 *   Array<Reducer=>Reducer>,
 * )(Reducer) -> composed Reducer
 *
 * @description
 * Chain together an array of functions as a pipe, each function passing its return value as the first argument to the next function until all functions have executed. The final result is the return of the last function execution.
 *
 * ```javascript [playground]
 * console.log(
 *   pipe([
 *     number => number + 1,
 *     number => number + 2,
 *     number => number + 3,
 *   ])(5),
 * ) // 11
 * ```
 *
 * When passed a reducer, a pipe of transducers composes the reducer such that the transducers are applied in series, finally calling the reducer to end the chain. The resulting reducer must be used in conjunction with `reduce` to have a transducing effect. For more information on this behavior, see [transducers](https://github.com/a-synchronous/rubico/blob/master/TRANSDUCERS.md).
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * const square = number => number ** 2
 *
 * const add = (a, b) => a + b
 *
 * const squaredOdds = pipe([
 *   filter(isOdd),
 *   map(square),
 * ])
 *
 * console.log(
 *   [1, 2, 3, 4, 5].reduce(squaredOdds(add), 0),
 * ) // 35
 *
 * console.log(
 *   squaredOdds([1, 2, 3, 4, 5])
 * ) // [1, 9, 25]
 * ```
 *
 * @execution series
 *
 * @transducing
 */

/**
 * @name fork
 *
 * @synopsis
 * fork(
 *   funcs Object<value=>Promise|any>,
 * )(value any) -> Promise|Object
 *
 * fork(
 *   funcs Array<value=>Promise|any>,
 * )(value any) -> Promise|Array
 *
 * @description
 * Parallelize multiple functions with concurrent execution into either an object or array.
 *
 *  * `fork(Array<function>) -> Array` - an Array result is yielded for an Array of functions
 *  * `fork(Object<function>) -> Object` - an Object result is yielded for an Object of functions
 *
 * ```javascript [playground]
 * console.log(
 *   fork({
 *     greetings: fork([
 *       greeting => greeting + 'world',
 *       greeting => greeting + 'mom',
 *     ]),
 *   })('hello'),
 * ) // { greetings: ['hello world', 'hello mom'] }
 * ```
 *
 * @execution concurrent
 */
