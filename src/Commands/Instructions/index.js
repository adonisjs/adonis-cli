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
const BaseCommand = require('../Base')

class Instructions extends BaseCommand {
  constructor (Helpers) {
    super()
    const FakeHelpers = require('@adonisjs/ignitor/src/Helpers')
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
   * @return {void}
   */
  async handle ({ directory }, options) {
    await this.invoke(async () => {
      const modulePath = path.isAbsolute(directory) ? directory : path.join(process.cwd(), directory)
      const name = options.name || path.basename(modulePath)
      const Context = require('./Context')
      const ctx = new Context(this, this.Helpers)

      await require('../../Services/run-instructions')(ctx, modulePath)
      await require('../../Services/render-instructions-md')(modulePath, name)
    })
  }
}

module.exports = Instructions
