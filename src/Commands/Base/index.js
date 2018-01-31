'use strict'

/**
 * adonis-cli
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const gradient = require('gradient-string')
const path = require('path')

const ace = require('../../../lib/ace')

class BaseCommand extends ace.Command {
  /**
   * Returns an instance of steps counter, based upon
   * command line flags
   *
   * @method initiateSteps
   *
   * @param  {Number}      count
   * @param  {Object}      options
   *
   * @return {Object}
   */
  initiateSteps (count, options) {
    const { RawSteps, Steps } = require('../../../lib/Steps')
    return options.raw || process.env.DEBUG ? new RawSteps(count) : new Steps(count)
  }

  /**
   * Prints AdonisJs ascii art to the console
   *
   * @method dumpAsciiLogo
   *
   * @return {void}
   */
  dumpAsciiLogo () {
    console.log(gradient.rainbow("    _       _             _         _     \n   / \\   __| | ___  _ __ (_)___    | |___ \n  / _ \\ / _` |/ _ \\| '_ \\| / __|_  | / __|\n / ___ \\ (_| | (_) | | | | \\__ \\ |_| \\__ \\\n/_/   \\_\\__,_|\\___/|_| |_|_|___/\\___/|___/\n"))
  }

  /**
   * Invokes a function, by automatically catching for errors
   * and printing them in a standard way
   *
   * @method invoke
   *
   * @param  {Function} callback
   *
   * @return {void}
   */
  async invoke (callback) {
    try {
      await callback()
    } catch (error) {
      this.printError(error)
      process.exit(1)
    }
  }

  /**
   * Prints error object to the console
   *
   * @method printError
   *
   * @param  {Object}   error
   *
   * @return {void}
   */
  printError (error) {
    console.log(`\n  ${this.chalk.bgRed(' ERROR ')} ${error.message}\n`)

    if (error.hint) {
      console.log(`\n  ${this.chalk.bgRed(' HELP ')} ${error.hint}\n`)
    }
  }

  /**
   * Throws exception when user is not inside the project root
   *
   * @method ensureInProjectRoot
   *
   * @return {void}
   */
  async ensureInProjectRoot () {
    const exists = await this.pathExists(path.join(process.cwd(), 'ace'))
    if (!exists) {
      throw new Error(`Make sure you are inside an adonisjs app to run the ${this.constructor.commandName} command`)
    }
  }

  /**
   * Throws error when NODE_ENV = production and `--force` flag
   * has not been passed.
   *
   * @method ensureCanRunInProduction
   *
   * @param  {Object}                 options
   *
   * @return {void}
   */
  ensureCanRunInProduction (options) {
    if (process.env.NODE_ENV === 'production' && !options.force) {
      throw new Error(`Cannot run ${this.constructor.commandName} command in production. Pass --force flag to continue`)
    }
  }

  /**
   * Calls a command registered with ace
   *
   * @method call
   *
   * @param  {String} command
   * @param  {Object} options
   * @param  {Object} flags
   *
   * @return {void}
   */
  call (command, options, flags) {
    return ace.call(command, options, flags)
  }
}

module.exports = BaseCommand
