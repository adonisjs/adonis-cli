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
 * Make a new exception class
 *
 * @class MakeException
 * @constructor
 */
class MakeException extends BaseCommand {
  /**
   * The command signature
   *
   * @method signature
   *
   * @return {String}
   */
  static get signature () {
    return `
    make:exception
    { name: Name of the exception }
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
    return 'Make a new exception'
  }

  /**
   * Handle method executed by ace
   *
   * @method handle
   *
   * @param  {String} options.name
   * @param  {String} options.type
   *
   * @return {void}
   */
  async handle ({ name }) {
    await this.invoke(async () => {
      await this.ensureInProjectRoot()
      await this.generateBlueprint('exception', name, {})
    })
  }
}

module.exports = MakeException
