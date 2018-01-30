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
const copyEnvFile = require('../src/Services/copy-env-file')

test.group('New | Steps | copy env file', (group) => {
  group.after(async () => {
    await fs.remove(path.join(__dirname, './yardstick-app'))
    await fs.remove(path.join(__dirname, './yardstick'))
  })

  test('Copy env.example to .env', async (assert) => {
    const appPath = path.join(__dirname, './yardstick')
    await fs.ensureFile(path.join(appPath, '.env.example'))
    const stepsCounter = new Steps(1)

    process.chdir(appPath)
    await copyEnvFile(appPath, stepsCounter)

    await fs.pathExists(path.join(appPath, '.env'))
    await fs.remove(path.join(appPath, '.env'))
    await fs.remove(path.join(appPath, '.env.example'))

    process.chdir(__dirname)
  }).timeout(0)
})
