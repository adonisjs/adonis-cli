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
const { Command } = require('../../../lib/ace')

/**
 * Setup shared adonisjs projects
 *
 * @class Setup
 * @constructor
 */
class Setup extends Command {
  /**
   * The command signature used by ace
   *
   * @method signature
   *
   * @return {String}
   */
  static get signature () {
    return `setup`
  }

  /**
   * The command description used by ace
   *
   * @method description
   *
   * @return {String}
   */
  static get description () {
    return 'Setup a project using setup.js file inside the project root'
  }

  /**
   * Method executed by ace to run the setup command
   *
   * @method handle
   *
   * @return {void}
   */
  async handle () {
    const acePath = path.join(process.cwd(), 'ace')
    const setupFilePath = path.join(process.cwd(), 'setup.js')

    const exists = await this.pathExists(acePath)

    if (!exists) {
      this.error('Make sure you are inside an adonisjs app to start the server')
      return
    }

    const setupFileExists = await this.pathExists(setupFilePath)
    if (!setupFileExists) {
      this.error('There is no setup file inside this project')
      return
    }

    await require(setupFilePath)(this, require('shelljs'))
    this.completed('setup', 'Completed')
  }
}

module.exports = Setup
