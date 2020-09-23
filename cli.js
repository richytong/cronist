#!/usr/bin/env node

'use strict'

const rubico = require('rubico')
const trace = require('rubico/x/trace')
const fs = require('fs')
const nodePath = require('path')
const util = require('util')
const cronist = require('.')

const {
  pipe, fork, assign,
  tap, tryCatch, switchCase,
  map, filter, reduce, transform, flatMap,
  any, all, and, or, not,
  eq, gt, lt, gte, lte,
  get, pick, omit,
} = rubico

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
  )(dirents),
])

// object -> code string
const toJavaScript = pipe([
  object => util.inspect(object, { depth: Infinity }),
  code => code.replace(/Position /g, ''),
  code => `export default ${code}`,
])

// { entrypoint: string|Array<string> } -> ()
const cli = pipe([
  tap.if(any(value => value == null), argumentObject => {
    console.error('invalid arguments', argumentObject)
    process.exit(1)
  }),
  get('entrypoint'),
  flatMap(switchCase([
    path => path.endsWith('.js'), Array.of,
    walkPathForJSFilePaths])),
  flatMap(pipe([
    fs.promises.readFile, toString, cronist])),
  toJavaScript,
  trace,
])

cli({
  entrypoint: process.argv.slice(2),
})
