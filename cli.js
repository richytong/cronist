#!/usr/bin/env node

'use strict'

const rubico = require('rubico')
const rubicoX = require('rubico')
const trace = require('rubico/x/trace')
const fs = require('fs')
const nodePath = require('path')
const util = require('util')
const cronist = require('.')

const {
  pipe, tap,
  switchCase, tryCatch,
  fork, assign, get, pick, omit,
  map, filter, reduce, transform, flatMap,
  and, or, not, any, all,
  eq, gt, lt, gte, lte,
  thunkify, always,
  curry, __,
} = rubico

const {
  isEmpty,
} = rubicoX

// any => any
const identity = value => value

// string => string
const pathResolve = nodePath.resolve

// path string => Array<fs.Dirent>
const readdirWithFileTypes = path => fs.promises.readdir(path, {
  withFileTypes: true,
})

// object => string
const toString = value => value.toString()

const IGNORE_DIRS = new Set(['.git', 'node_modules'])

// fs.Dirent => boolean
const direntIsIgnored = dirent => IGNORE_DIRS.has(dirent.name)

// fs.Dirent => boolean
const direntIsDirectory = dirent => dirent.isDirectory()

// fs.Dirent => boolean
const direntIsJSFile = dirent => dirent.name.endsWith('.js')

// path string => jsFilePaths Array<string>
const walkPathForJSFilePaths = pipe([
  fork({
    path: identity,
    dirents: tryCatch(readdirWithFileTypes, () => []),
  }),
  ({ path, dirents }) => transform(
    map(switchCase([
      and([
        direntIsDirectory,
        not(direntIsIgnored),
      ]), pipe([
        dirent => pathResolve(path, dirent.name),
        walkPathForJSFilePaths]),
      direntIsJSFile, pipe([
        dirent => pathResolve(path, dirent.name),
        Array.of]),
      () => [],
    ])),
    () => [],
  )(dirents)
])

// object -> code string
const toJavaScript = pipe([
  object => util.inspect(object, { depth: Infinity, maxArrayLength: null }),
  code => code.replace(/Position /g, ''),
  code => `export default ${code}`,
])

// args Array<string> -> ()
const cli = args => {
  const requiredKeys = args.includes('--required-keys')
    ? args[args.indexOf('--required-keys') + 1].split(',')
    : null
  return pipe([
    args => ({
      entrypoint: args.filter(not(arg => arg.startsWith('-'))),
    }),
    tap.if(eq(0, get('entrypoint.length')), () => {
      console.error('path arguments required')
      process.exit(1)
    }),
    get('entrypoint'),
    flatMap(switchCase([
      path => path.endsWith('.js'),
      Array.of,
      walkPathForJSFilePaths
    ])),
    flatMap(pipe([
      fs.promises.readFile,
      toString,
      curry.arity(2, cronist, __, requiredKeys),
    ])),
    toJavaScript,
    trace,
  ])(args)
}

cli(process.argv.slice(2))
