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
 * Make a new lucid model hook
 *
 * @class MakeModelHook
 * @constructor
 */
class MakeModelHook extends BaseCommand {
  /**
   * The command signature
   *
   * @method signature
   *
   * @return {String}
   */
  static get signature () {
    return `
    make:hook
    { name: Name of the hook }
    { -m, --method=@value : The method to be created on hook }
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
    return 'Make a new lucid model hook'
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
  async handle ({ name }, { method }) {
    await this.invoke(async () => {
      await this.ensureInProjectRoot()
      await this.generateBlueprint('hook', name, { method })
    })
  }
}

module.exports = MakeModelHook
