'use strict'

/*
 * adonis-cli
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const path = require('path')
const steps = require('../Install/steps')
const Context = require('../Install/Context')
const { Command } = require('../../../lib/ace')
const FakeHelpers = require('@adonisjs/ignitor/src/Helpers')

const ERROR_HEADING = `
=============================================
Installation failed due to following error
=============================================`

class Instructions extends Command {
  constructor (Helpers) {
    super()
    this.Helpers = Helpers || new FakeHelpers(process.cwd())
  }

  /**
   * Injecting dependencies
   *
   * @method inject
   *
   * @return {Array}
   */
  static get inject () {
    return ['Adonis/Src/Helpers']
  }

  /**
   * The command signature
   *
   * @method signature
   *
   * @return {String}
   */
  static get signature () {
    return `
    run:instructions
    { directory : Directory path for which to run instructions }
    { --as=@value: Name of the module }
    `
  }

  /**
   * The command description
   *
   * @method description
   *
   * @return {String}
   */
  static get description () {
    return 'Run instructions for a given module'
  }

  /**
   * Handle method executed by ace when command runs. It will
   * install a module and run post install instructions
   *
   * @method handle
   *
   * @param  {String}  options.module
   * @param  {Boolean} options.yarn
   * @param  {Boolean} options.skipInstructions
   *
   * @return {void}
   */
  async handle ({ directory }, { as: name }) {
    const modulePath = path.isAbsolute(directory) ? directory : path.join(process.cwd(), directory)
    name = name || path.basename(modulePath)
    const ctx = new Context(this, this.Helpers)

    try {
      /**
       * Step: 2
       *
       * Check if module has `instructions.js` file and
       * run the instructions in that case
       */
      await steps.runInstructions(ctx, modulePath)

      /**
       * Step: 3
       *
       * Check if module has `instructions.md` file and
       * render the markdown as html.
       */
      await steps.renderInstructions(
        modulePath,
        name,
        this.readFile.bind(this),
        this.writeFile.bind(this)
      )
    } catch (error) {
      this.error(ERROR_HEADING)
      console.log(error.message)
      process.exit(1)
    }
  }
}

module.exports = Instructions
