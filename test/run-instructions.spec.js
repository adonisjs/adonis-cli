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
const clearRequire = require('clear-require')

const BASE_PATH = path.join(__dirname, 'dummyProject')
const Context = require('../src/Commands/Instructions/Context')

/**
 * Writes the instructions file to the `BASE_PATH`.
 * @param {String} contents
 */
const writeInstructionsJs = function (contents) {
  return fs.writeFile(path.join(BASE_PATH, 'instructions.js'), contents)
}

/**
 * Gives a new instance of contents
 *
 * @returns Context
 */
const getContext = function () {
  const command = new ace.Command()
  return new Context(command, new Helpers(BASE_PATH))
}

if (process.platform !== 'win32') {
  test.group('Run instructions', (group) => {
    group.before(async () => {
      setupResolver()
      await fs.ensureDir(BASE_PATH)
    })

    group.afterEach(async () => {
      clearRequire(path.join(BASE_PATH, 'instructions.js'))
      await fs.emptyDir(BASE_PATH)
    })

    group.after(async () => {
      await fs.remove(BASE_PATH)
    })

    group.beforeEach(() => {
      process.chdir(BASE_PATH)
      ace.commands = {}
    })

    test('run instructions', async (assert) => {
      await writeInstructionsJs(`
      module.exports = async function (cli) {
        cli.executed = true
      }`)

      const ctx = getContext()
      await require('../src/Services/run-instructions')(ctx, BASE_PATH)
      assert.isTrue(ctx.executed)
    }).timeout(0)

    test('save config file via instructions', async (assert) => {
      const sessionTemplate = `
        module.exports = {
          driver: 'cookie'
        }
      `
      await fs.writeFile(path.join(BASE_PATH, 'session.mustache'), sessionTemplate)

      await writeInstructionsJs(`
        const path = require('path')
        module.exports = async function (cli) {
          await cli.makeConfig('session.js', path.join(__dirname, './session.mustache'))
        }
      `)

      await require('../src/Services/run-instructions')(getContext(), BASE_PATH)

      require(path.join(BASE_PATH, 'config/session.js'))
    }).timeout(0)

    test('throw exceptions of instructions file', async (assert) => {
      assert.plan(1)

      await writeInstructionsJs(`
      const path = require('path')
      module.exports = async function (cli) {
        cli.foo()
      }`)

      try {
        await require('../src/Services/run-instructions')(getContext(), BASE_PATH)
      } catch ({ message }) {
        assert.equal(message, 'instructions.js: cli.foo is not a function')
      }
    }).timeout(0)

    test('instructions call ace commands', async (assert) => {
      await writeInstructionsJs(`
        module.exports = async function (cli) {
          await cli.callCommand('make:model', { name: 'User' })
        }
      `)

      await fs.writeFile(path.join(BASE_PATH, 'ace'), '')
      ace.addCommand(require('../src/Commands')['make:model'])

      await require('../src/Services/run-instructions')(getContext(), BASE_PATH)
      const exists = await fs.exists(path.join(BASE_PATH, 'app/Models/User.js'))
      assert.isTrue(exists)
    }).timeout(0)

    test('instructions copy files', async (assert) => {
      await writeInstructionsJs(`
      const path = require('path')

      module.exports = async function (cli) {
        await cli.copy(path.join(__dirname, './foo.js'), cli.helpers.tmpPath('./foo.js'))
      }`)

      await fs.writeFile(path.join(BASE_PATH, 'foo.js'), '')
      await require('../src/Services/run-instructions')(getContext(), BASE_PATH)
      require(path.join(BASE_PATH, 'tmp/foo.js'))
    }).timeout(0)

    test('ignore when instructions.js file does not exists', async (assert) => {
      await require('../src/Services/run-instructions')(getContext(), BASE_PATH)
    }).timeout(0)

    test('ignore when instructions.md file does not exists', async (assert) => {
      await require('../src/Services/render-instructions-md')(BASE_PATH, '@adonisjs/session')
    }).timeout(0)
  })
}
