const cronist = require('.')
const assert = require('assert')
const fs = require('fs')

describe('cronist', () => {
  it('transforms comments into documentation objects', async () => {
    const comments = await fs.promises.readFile('./comments.js')
    const docObjects = cronist(comments.toString())
    assert.equal(docObjects.length, 3)
    for (const object of docObjects) {
      assert(!object.name.includes('\n'))
      assert(!object.name.includes('@'))
      assert.equal(typeof object.name, 'string')
      assert.equal(typeof object.mdast.name, 'object')
    }
  })

  it('accepts an array of keys', async () => {
    const comments = await fs.promises.readFile('./comments.js')
    const docObjects = cronist(comments.toString(), ['name', 'synopsis', 'description'])
    assert.equal(docObjects.length, 2)
    for (const object of docObjects) {
      assert(!object.name.includes('\n'))
      assert(!object.name.includes('@'))
      assert.equal(typeof object.name, 'string')
      assert.equal(typeof object.synopsis, 'string')
      assert.equal(typeof object.description, 'string')
      assert.equal(typeof object.mdast, 'object')
      assert.equal(typeof object.mdast.name, 'object')
      assert.equal(typeof object.mdast.synopsis, 'object')
      assert.equal(typeof object.mdast.description, 'object')
    }
  })
})
