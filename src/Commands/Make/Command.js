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
 * Creates a new ace command
 *
 * @class MakeCommand
 * @constructor
 */
class MakeCommand extends BaseCommand {
  /**
   * The command signature
   *
   * @method signature
   *
   * @return {String}
   */
  static get signature () {
    return `
    make:command
    { name: Name of the command }
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
    return 'Make a new ace command'
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
    try {
      await this.ensureInProjectRoot()
      const { namespace } = await this.generateBlueprint('command', name, {})

      const lines = [
        'Register command as follows',
        '',
        `1. Open ${this.chalk.cyan('start/app.js')}`,
        `2. Add ${this.chalk.cyan(namespace)} to commands array`
      ]

      this.printInstructions(lines)
    } catch ({ message }) {
      this.error(message)
    }
  }
}

module.exports = MakeCommand
