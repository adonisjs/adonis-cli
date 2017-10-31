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
    try {
      await this.ensureInProjectRoot()
      await this.generateBlueprint('trait', name, {})

      const lines = [
        `Register your ${name} trait with any model as follows`,
        '',
        `
const Model = use('Model')
const ${name} = use('App/Models/Traits/${name}')

class {{name}} extends Model {
  static boot() {
    super.boot()
    this.addTrait(${name}())
  }
}
        `
      ]

      this.printInstructions(lines)
    } catch ({ message }) {
      this.error(message)
    }
  }
}

module.exports = MakeTrait
