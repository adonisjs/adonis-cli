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
const steps = require('./steps')
const Context = require('./Context')
const { Command } = require('../../../lib/ace')

const ERROR_HEADING = `
=============================================
Installation failed due to following error
=============================================`

class Install extends Command {
  constructor (Helpers) {
    super()
    this.Helpers = Helpers
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
    install
    { module : Npm module name }
    { --as=@value : Name of the module, required when installing from github or local file system }
    { --yarn: Use yarn over npm for installation }
    { -s, --skip-instructions: Do not run post install instructions }
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
    return 'Install Adonisjs provider from npm/yarn and run post install instructions'
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
  async handle ({ module: packageName }, { yarn, skipInstructions, as: name }) {
    const acePath = path.join(process.cwd(), 'ace')
    const exists = await this.pathExists(acePath)

    /**
     * Throw error if not inside an adonisjs app
     */
    if (!exists) {
      this.error('Make sure you are inside an adonisjs app to install dependencies')
      return
    }

    const icon = this.icon.bind(this)
    const chalk = this.chalk
    const via = yarn ? 'yarn' : 'npm'
    const modulePath = path.join(process.cwd(), 'node_modules', name || packageName)
    const ctx = new Context(this, this.Helpers)

    try {
      /**
       * Step: 1
       *
       * Install the package via yarn or npm based
       * upon user preference
       */
      await steps.install(via, packageName, chalk, icon)

      /**
       * Return in mid-way if skip instructions flag
       * was passed.
       */
      if (skipInstructions) {
        return
      }

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
        name || packageName,
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

module.exports = Install
