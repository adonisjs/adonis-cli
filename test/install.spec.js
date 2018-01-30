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

const BASE_PATH = path.join(__dirname, 'dummyProject')

if (process.platform !== 'win32') {
  test.group('Install | Command', (group) => {
    group.before(async () => {
      await fs.ensureDir(BASE_PATH)
      await fs.outputJSON(path.join(BASE_PATH, 'package.json'), {
        name: 'dummy-project'
      })
    })

    group.afterEach(async () => {
      await fs.emptyDir(BASE_PATH)
    })

    group.after(async () => {
      await fs.remove(BASE_PATH)
    })

    test('install a package from npm', async (assert) => {
      process.chdir(BASE_PATH)
      const stepsCounter = new Steps(1)

      await require('../src/Services/install')('npm', stepsCounter, '@adonisjs/session')
      const exists = await fs.exists(path.join(BASE_PATH, 'node_modules/@adonisjs/session'))
      assert.isTrue(exists)
    }).timeout(0)

    test('throw exception when unable to install package', async (assert) => {
      assert.plan(2)
      process.chdir(BASE_PATH)

      const stepsCounter = new Steps(1)

      try {
        await require('../src/Services/install')('npm', stepsCounter, '@adonisjs/foo')
      } catch (error) {
        const exists = await fs.exists(path.join(BASE_PATH, 'node_modules/@adonisjs/foo'))
        assert.isFalse(exists)
        assert.include(error.message, 'npm ERR! code E404')
      }
    }).timeout(0)
  })
}
