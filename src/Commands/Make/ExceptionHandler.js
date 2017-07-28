'use strict'

/*
 * adonis-cli
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

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
    try {
      await this.ensureInProjectRoot()
      await this.generateBlueprint('exceptionHandler', '', {})
    } catch ({ message }) {
      this.error(message)
    }
  }
}

module.exports = MakeExceptionHandler
