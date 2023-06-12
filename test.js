const cronist = require('.')
const assert = require('assert')
const fs = require('fs')

describe('cronist', () => {
  it('transforms comments into documentation objects', async () => {
    const comments = await fs.promises.readFile('./comments.js')
    const docObjects = cronist(comments.toString())
    assert.equal(docObjects.length, 3)
    assert(docObjects[0].mdast.synopsis.children[0].type == 'yaml')
    for (const docObject of docObjects) {
      assert(!docObject.name.includes('\n'))
      assert(!docObject.name.includes('@'))
      assert.equal(typeof docObject.name, 'string')
      assert.equal(typeof docObject.mdast.name, 'object')
    }
  })

  it('accepts an array of keys', async () => {
    const comments = await fs.promises.readFile('./comments.js')
    const docObjects = cronist(comments.toString(), ['name', 'synopsis', 'description'])
    assert.equal(docObjects.length, 2)
    for (const docObject of docObjects) {
      assert(!docObject.name.includes('\n'))
      assert(!docObject.name.includes('@'))
      assert.equal(typeof docObject.name, 'string')
      assert.equal(typeof docObject.synopsis, 'string')
      assert.equal(typeof docObject.description, 'string')
      assert.equal(typeof docObject.mdast, 'object')
      assert.equal(typeof docObject.mdast.name, 'object')
      assert.equal(typeof docObject.mdast.synopsis, 'object')
      assert.equal(typeof docObject.mdast.description, 'object')
    }
  })
})
