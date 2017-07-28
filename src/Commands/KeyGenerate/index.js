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
const ERROR_HEADING = `
=============================================
Received following error
=============================================`

/**
 * Generate unique application key
 *
 * @class KeyGenerate
 * @constructor
 */
class KeyGenerate extends Command {
  /**
   * The command signature used by ace
   *
   * @method signature
   *
   * @return {String}
   */
  static get signature () {
    return `
    key:generate
    { -f, --force: Forcefully generate the key in production environment }
    { --env=@value: .env file location }
    { -s, --size=@value: The key size which defaults to 32 characters }
    { --echo: Echo the key instead of writing to the file }
    `
  }

  /**
   * The command description used by ace
   *
   * @method description
   *
   * @return {String}
   */
  static get description () {
    return 'Generate secret key for the app'
  }

  /**
   * Load related dependencies
   *
   * @method loadVendor
   *
   * @return {void}
   */
  loadVendor () {
    this.randomString = require('randomstring')
    this.dotEnv = require('dotenv')
  }

  /**
   * Method executed by ace to start the HTTP server
   *
   * @method handle
   *
   * @param  {Object} args
   * @param  {Boolean} options.dev
   *
   * @return {void}
   */
  async handle (args, { force = false, echo = false, size, env }) {
    /**
     * Asking for user conscious
     */
    if (process.env.NODE_ENV === 'production' && !force) {
      this.error('Cannot generate APP_KEY in production. Pass --force flag to generate')
    }

    size = size || 32
    env = env || '.env'

    const acePath = path.join(process.cwd(), 'ace')
    const exists = await this.pathExists(acePath)

    /**
     * Throw error if not inside an adonisjs app
     */
    if (!exists) {
      this.error('Make sure you are inside an adonisjs app to generate the app key')
      return
    }

    this.loadVendor()
    const key = this.randomString.generate(Number(size) || 32)

    /**
     * Echo key to console when echo is set to true
     * and return
     */
    if (echo) {
      console.log(`APP_KEY=${key}`)
      return
    }

    try {
      const pathToEnv = path.isAbsolute(env) ? env : path.join(process.cwd(), env)
      const dotEnvContents = await this.readFile(pathToEnv)
      const envHash = this.dotEnv.parse(dotEnvContents)
      envHash.APP_KEY = key

      const updatedContents = Object.keys(envHash).map((key) => {
        return `${key}=${envHash[key]}`
      }).join('\n')

      await this.writeFile(pathToEnv, updatedContents)
      console.log(this.chalk.green(`${this.icon('success')} generated unique APP_KEY`))
    } catch (error) {
      this.error(`${this.icon('error')} Sorry we failed at setting up the APP_KEY`)
      this.error(ERROR_HEADING)
      console.log(error)
    }
  }
}

module.exports = KeyGenerate
