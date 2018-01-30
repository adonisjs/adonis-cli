'use strict'

/*
 * adonis-lucid
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const BaseCommand = require('./Base')

/**
 * Make a new seed file
 *
 * @class MakeSeed
 * @constructor
 */
class MakeSeed extends BaseCommand {
  /**
   * Command signature required by ace
   *
   * @method signature
   *
   * @return {String}
   */
  static get signature () {
    return `
    make:seed
    { name?=Database: Name of the seed file }
    `
  }

  /**
   * Command description
   *
   * @method description
   *
   * @return {String}
   */
  static get description () {
    return 'Create a database seeder'
  }

  /**
   * Method to be called when this command is executed
   *
   * @method handle
   *
   * @param  {String} options.name
   */
  async handle ({ name }) {
    await this.invoke(async () => {
      await this.ensureInProjectRoot()
      await this.generateBlueprint('seed', name)
    })
  }
}

module.exports = MakeSeed
