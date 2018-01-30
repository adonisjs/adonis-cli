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
 * Make a new lucid trait
 *
 * @class MakeTrait
 * @constructor
 */
class MakeTrait extends BaseCommand {
  /**
   * The command signature
   *
   * @method signature
   *
   * @return {String}
   */
  static get signature () {
    return `
    make:trait
    { name: Name of the trait }
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
    return 'Make a new lucid trait'
  }

  /**
   * Handle method executed by ace
   *
   * @method handle
   *
   * @param  {String} options.name
   *
   * @return {void}
   */
  async handle ({ name }) {
    await this.invoke(async () => {
      await this.ensureInProjectRoot()
      await this.generateBlueprint('trait', name, {})
    })
  }
}

module.exports = MakeTrait
