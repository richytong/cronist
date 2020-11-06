'use strict'

const rubico = require('rubico')
const trace = require('rubico/x/trace')
const commentParser = require('comment-parser')
const unified = require('unified')
const markdown = require('remark-parse')

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

const isArray = Array.isArray

const identity = value => value

const split = expr => value => value.split(expr)

const slice = (from, to) => value => value.slice(from, to)

const join = delimiter => value => value.join(delimiter)

// tagName string => parsedComment Object => boolean
const parsedCommentHasTag = tagName => function lookingForTag(parsedComment) {
  return parsedComment.tags.findIndex(tag => tag.tag == tagName) != -1
}

// (tagName string, defaultValue any?) => parsedComment Object => object
const parsedCommentGetTag = (
  tagName, defaultValue,
) => function gettingTag(parsedComment) {
  const tag = parsedComment.tags.find(tag => tag.tag == tagName)
  return tag === undefined ? defaultValue : tag
}

// parsedComment Object => docName string
const parsedCommentGetName = pipe([parsedCommentGetTag('name'), get('name')])

// (expr string|RegExp, replacement string) => value string => replaced string
const replace = (expr, replacement) => function replacing(value) {
  return value.replace(expr, replacement)
}

// value string => trimmed string
const trim = value => value.trim()

// tagName string => parsedComment => doc Object
const parsedCommentToDocSourceBy = tagName => pipe([
  parsedCommentGetTag(tagName),
  get('source'),
  replace(/^@[\w-]+[\n\s]+/, ''),
  trim,
])


// parsedComment => docSource {}
const parsedCommentToDocSource = pipe([
  get('tags'),
  reduce(
    (docSource, tag) => {
      const docSourceKey = tag.tag,
        docSourceItem = tag.source.replace(/^@[\w-]+[\n\s]+/, '').trim()
      if (docSource[docSourceKey] == null) {
        docSource[docSourceKey] = docSourceItem
      } else {
        const current = docSource[docSourceKey]
        docSource[docSourceKey] = [current, docSourceItem]
      }
      return docSource
    }, () => ({})),
])

const excludedFunctions = new Set([])

// docSource Object => boolean
const docSourceIsExclusion = docSource => excludedFunctions.has(docSource.name)

// code string => Array<ParsedComments>
const parseComments = code => commentParser(code, { trim: false })

const markdownParser = unified().use(markdown)

// code string => something
const parseMarkdown = code => markdownParser.parse(code)

// stdout as a Semigroup
const Stdout = {
  concat(...args) {
    console.log(...args)
    return this
  },
}

// code string => Array<Object<markdown string>>
const cronist = function (
  code, { keys, delimiter = ',' } = {},
) {
  const mdastHasAllRequiredFields = keys == null
    ? always(true)
    : and(keys.map(parsedCommentHasTag))
  return pipe([
    parseComments,
    transform(
      pipe([
        filter(mdastHasAllRequiredFields),
        map(parsedCommentToDocSource),
        filter(not(docSourceIsExclusion)),
        map(assign({
          mdast: map(parseMarkdown),
        })),
      ]),
      () => [],
    ),
  ])(code)
}

cronist.parseMarkdown = parseMarkdown

module.exports = cronist
