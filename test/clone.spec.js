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
const fs = require('fs-extra')
const Steps = require('cli-step')
const clone = require('../src/Services/clone')

test.group('New | Steps | clone', (group) => {
  group.after(async () => {
    await fs.remove(path.join(__dirname, './yardstick-app'))
    await fs.remove(path.join(__dirname, './yardstick'))
  })

  test('throw error when cannot clone repo', async (assert) => {
    const appPath = path.join(__dirname, './yardstick')
    assert.plan(1)
    const stepsCounter = new Steps(1)

    try {
      process.env.GIT_TERMINAL_PROMPT = 0
      await clone('adonisjs/foo-app', appPath, stepsCounter)
    } catch ({ message }) {
      assert.isDefined(message)
    }
  }).timeout(0)

  test('clone repo when it exists', async (assert) => {
    const appPath = path.join(__dirname, './yardstick')
    const stepsCounter = new Steps(1)

    await clone('adonisjs/adonis-app', appPath, stepsCounter)
    await fs.pathExists(appPath)
    await fs.remove(appPath)
  }).timeout(0)

  test('clone repo with specific branch', async (assert) => {
    const appPath = path.join(__dirname, './yardstick-app')
    const stepsCounter = new Steps(1)

    await clone('adonisjs/adonis-app', appPath, stepsCounter, 'develop')

    await fs.pathExists(appPath)
    process.chdir(appPath)

    const branch = await require('../src/Services/exec')('git branch')
    assert.equal(branch.replace('*', '').trim(), 'develop')
    process.chdir(__dirname)
  }).timeout(0)
})
