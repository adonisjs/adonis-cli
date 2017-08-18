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
const ace = require('../lib/ace')
const { Helpers, setupResolver } = require('@adonisjs/sink')
const fs = require('fs-extra')
const Chalk = require('chalk')
const clearRequire = require('clear-require')

const steps = require('../src/Commands/Install/steps')
const BASE_PATH = path.join(__dirname, 'dummyProject')
const Context = require('../src/Commands/Install/Context')
const chalk = new Chalk.constructor({ enabled: false })

if (process.platform !== 'win32') {
  test.group('Install | Command', (group) => {
    group.before(async () => {
      setupResolver()
      await fs.ensureDir(BASE_PATH)
      await fs.outputJSON(path.join(BASE_PATH, 'package.json'), {
        name: 'dummy-project'
      })
    })

    group.afterEach(async () => {
      clearRequire(path.join(BASE_PATH, 'instructions.js'))
      await fs.emptyDir(BASE_PATH)
    })

    group.after(async () => {
      await fs.remove(BASE_PATH)
    })

    group.beforeEach(() => {
      ace.commands = {}
    })

    test('install a package from npm', async (assert) => {
      process.chdir(BASE_PATH)
      await steps.install('npm', '@adonisjs/session', chalk, function () {})
      const exists = await fs.exists(path.join(BASE_PATH, 'node_modules/@adonisjs/session'))
      assert.isTrue(exists)
    }).timeout(0)

    test('throw exception when unable to install package', async (assert) => {
      assert.plan(2)

      process.chdir(BASE_PATH)

      try {
        await steps.install('npm', '@adonisjs/foo', chalk, function () {})
      } catch (error) {
        const exists = await fs.exists(path.join(BASE_PATH, 'node_modules/@adonisjs/foo'))
        assert.isFalse(exists)
        assert.include(error.message, 'npm ERR! code E404')
      }
    }).timeout(0)

    test('run instructions', async (assert) => {
      process.chdir(BASE_PATH)

      const instructions = `
      module.exports = async function (cli) {
        cli.executed = true
      }`

      await fs.writeFile(path.join(BASE_PATH, 'instructions.js'), instructions)

      const ctx = {}
      await steps.runInstructions(ctx, BASE_PATH)

      assert.isTrue(ctx.executed)
    }).timeout(0)

    test('save config file via instructions', async (assert) => {
      process.chdir(BASE_PATH)

      const sessionTemplate = `
      module.exports = {
        driver: 'cookie'
      }`
      await fs.writeFile(path.join(BASE_PATH, 'session.mustache'), sessionTemplate)

      const instructions = `
      const path = require('path')
      module.exports = async function (cli) {
        await cli.makeConfig('session.js', path.join(__dirname, './session.mustache'))
      }`
      await fs.writeFile(path.join(BASE_PATH, 'instructions.js'), instructions)

      const ctx = new Context(new ace.Command(), new Helpers(BASE_PATH))
      await steps.runInstructions(ctx, BASE_PATH)

      require(path.join(BASE_PATH, 'config/session.js'))
    }).timeout(0)

    test('throw exceptions of instructions file', async (assert) => {
      assert.plan(1)
      process.chdir(BASE_PATH)

      const instructions = `
      const path = require('path')
      module.exports = async function (cli) {
        cli.foo()
      }`

      await fs.writeFile(path.join(BASE_PATH, 'instructions.js'), instructions)

      try {
        const ctx = new Context(new ace.Command(), new Helpers(BASE_PATH))
        await steps.runInstructions(ctx, BASE_PATH)
      } catch ({ message }) {
        assert.equal(message, 'instructions.js: cli.foo is not a function')
      }
    }).timeout(0)

    test('instructions call ace commands', async (assert) => {
      process.chdir(BASE_PATH)

      const instructions = `
      module.exports = async function (cli) {
        await cli.callCommand('make:model', { name: 'User' })
      }`

      await fs.writeFile(path.join(BASE_PATH, 'instructions.js'), instructions)
      await fs.writeFile(path.join(BASE_PATH, 'ace'), '')
      ace.addCommand(require('../src/Commands')['make:model'])

      const ctx = new Context(new ace.Command(), new Helpers(BASE_PATH))
      await steps.runInstructions(ctx, BASE_PATH)

      const exists = await fs.exists(path.join(BASE_PATH, 'app/Models/User.js'))
      assert.isTrue(exists)
    }).timeout(0)

    test('instructions copy files', async (assert) => {
      process.chdir(BASE_PATH)

      const instructions = `
      const path = require('path')

      module.exports = async function (cli) {
        await cli.copy(path.join(__dirname, './foo.js'), cli.helpers.tmpPath('./foo.js'))
      }`

      await fs.writeFile(path.join(BASE_PATH, 'instructions.js'), instructions)
      await fs.writeFile(path.join(BASE_PATH, 'foo.js'), '')
      ace.addCommand(require('../src/Commands')['make:model'])

      const ctx = new Context(new ace.Command(), new Helpers(BASE_PATH))
      await steps.runInstructions(ctx, BASE_PATH)
      require(path.join(BASE_PATH, 'tmp/foo.js'))
    }).timeout(0)

    test('copy instructions markdown file', async (assert) => {
      process.chdir(BASE_PATH)

      const instructions = `## Hello world`

      await fs.writeFile(path.join(BASE_PATH, 'instructions.md'), instructions)
      await steps.renderInstructions(BASE_PATH, '@adonisjs/session', fs.readFile.bind(fs), fs.writeFile.bind(fs))
    }).timeout(0)

    test('ignore when instructions file does not exists', async (assert) => {
      process.chdir(BASE_PATH)
      await steps.runInstructions({}, BASE_PATH)
    }).timeout(0)

    test('ignore when instructions.md file does not exists', async (assert) => {
      process.chdir(BASE_PATH)
      await steps.renderInstructions(BASE_PATH, '@adonisjs/session', fs.readFile.bind(fs), fs.writeFile.bind(fs))
    }).timeout(0)
  })
}
