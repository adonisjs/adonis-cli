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
const verifyExistingFolder = require('../src/Services/verify-existing-folder')

test.group('Verify Existing Folder', (group) => {
  group.after(async () => {
    await fs.remove(path.join(__dirname, './yardstick-app'))
    await fs.remove(path.join(__dirname, './yardstick'))
  })

  test('throw error when app dir exists and not empty', async (assert) => {
    const appPath = path.join(__dirname, './yardstick')
    await fs.ensureFile(path.join(appPath, 'package.json'))
    const stepsCounter = new Steps(1)

    assert.plan(1)

    try {
      await verifyExistingFolder(appPath, stepsCounter)
    } catch ({ message }) {
      assert.include(message, 'Cannot override contents of [yardstick]')
      await fs.remove(appPath)
    }
  })

  test('work fine with directory exists but is empty', async (assert) => {
    const appPath = path.join(__dirname, './yardstick')
    await fs.ensureDir(appPath)
    const stepsCounter = new Steps(1)

    await verifyExistingFolder(appPath, stepsCounter)
    await fs.remove(appPath)
  })

  test('ignore when directory doesn\'t exists', async (assert) => {
    const appPath = path.join(__dirname, './yardstick')
    const stepsCounter = new Steps(1)

    await verifyExistingFolder(appPath, stepsCounter)
  })
})
