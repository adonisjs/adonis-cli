'use strict'

/*
 * adonis-cli
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const test = require('japa')
const path = require('path')
const ace = require('@adonisjs/ace')
const fs = require('fs-extra')
const NewCommand = require('../src/Commands/New')

/**
 * Ignoring tests in windows, since appveyor has
 * weird file permission issues
 */
test.group('New | Command', (group) => {
  group.before(() => {
    process.chdir(__dirname)
  })

  group.after(async () => {
    await fs.remove(path.join(__dirname, './yardstick-app'))
    await fs.remove(path.join(__dirname, './yardstick'))
  })

  group.beforeEach(() => {
    ace.commands = {}
  })

  test('set default blueprint to fullstack app', async (assert) => {
    const newCommand = new NewCommand()
    assert.equal(newCommand._getBluePrint({}), 'adonisjs/adonis-fullstack-app')
  })

  test('update blueprint when --api-only flag is defined', async (assert) => {
    const newCommand = new NewCommand()
    assert.equal(newCommand._getBluePrint({ apiOnly: true }), 'adonisjs/adonis-api-app')
  })

  test('update blueprint when --slim flag is defined', async (assert) => {
    const newCommand = new NewCommand()
    assert.equal(newCommand._getBluePrint({ slim: true }), 'adonisjs/adonis-slim-app')
  })

  test('give priority to api-only over slim', async (assert) => {
    const newCommand = new NewCommand()
    assert.equal(newCommand._getBluePrint({ slim: true, apiOnly: true }), 'adonisjs/adonis-api-app')
  })

  test('give priority to blueprint over everything', async (assert) => {
    const newCommand = new NewCommand()
    assert.equal(newCommand._getBluePrint({ slim: true, apiOnly: true, 'blueprint': 'adonuxt' }), 'adonuxt')
  })
})
