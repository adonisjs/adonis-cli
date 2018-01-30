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
const BaseCommand = require('./Base')

/**
 * Make a new global exception handler
 *
 * @class MakeExceptionHandler
 * @constructor
 */
class MakeExceptionHandler extends BaseCommand {
  /**
   * The command signature
   *
   * @method signature
   *
   * @return {String}
   */
  static get signature () {
    return 'make:ehandler'
  }

  /**
   * The command description
   *
   * @method description
   *
   * @return {String}
   */
  static get description () {
    return 'Make a new global exception handler'
  }

  /**
   * Handle method executed by ace
   *
   * @method handle
   *
   * @return {void}
   */
  async handle () {
    await this.invoke(async () => {
      await this.ensureInProjectRoot()

      const packageFile = require(path.join(process.cwd(), 'package.json'))
      const version = packageFile['adonis-version'] || packageFile['version']

      /**
       * The exceptions template is different for 4.0 and newer
       * versions.
       */
      await this.generateBlueprint('exceptionHandler', '', {
        new: version !== '4.0.0'
      })
    })
  }
}

module.exports = MakeExceptionHandler
