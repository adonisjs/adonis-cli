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

class MakeModel extends BaseCommand {
  /**
   * The command signature
   *
   * @method signature
   *
   * @return {String}
   */
  static get signature () {
    return `
    make:model
    { name: Name of the model }
    { -m, --migration: Generate migration for the model }
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
    return 'Make a new lucid model'
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
  async handle ({ name }, { migration }) {
    try {
      await this.ensureInProjectRoot()
      await this.generateBlueprint('model', name, {})
      if (migration) {
        await this.generateBlueprint('schema', name, { action: 'create' })
      }
    } catch ({ message }) {
      this.error(message)
    }
  }
}

module.exports = MakeModel
