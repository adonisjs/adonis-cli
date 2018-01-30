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
const BaseCommand = require('../Base')

/**
 * Generate unique application key
 *
 * @class KeyGenerate
 * @constructor
 */
class KeyGenerate extends BaseCommand {
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
   * Reads the content of `.env` file and returns it as
   * an object
   *
   * @method getEnvContent
   *
   * @param  {String}      envPath
   *
   * @return {Object}
   */
  async getEnvContent (envPath) {
    const dotEnvContents = await this.readFile(envPath)
    return require('dotenv').parse(dotEnvContents)
  }

  /**
   * Updates the `.env` file by converting the object back
   * to a valid string
   *
   * @method updateEnvContents
   *
   * @param  {String}          envPath
   * @param  {Object}          envHash
   *
   * @return {void}
   */
  async updateEnvContents (envPath, envHash) {
    const updatedContents = Object.keys(envHash).map((key) => {
      return `${key}=${envHash[key]}`
    }).join('\n')

    await this.writeFile(envPath, updatedContents)
  }

  /**
   * Invoked by ace
   *
   * @method handle
   *
   * @param  {Object} args
   * @param  {Object} options
   *
   * @return {void}
   */
  async handle (args, options) {
    const size = options.size ? Number(options.size) : 32
    const key = require('randomstring').generate(size)

    /**
     * Echo key to console when echo is set to true
     * and return
     */
    if (options.echo) {
      console.log(`APP_KEY=${key}`)
      return
    }

    await this.invoke(async () => {
      this.ensureCanRunInProduction(options)
      await this.ensureInProjectRoot()

      const env = options.env || '.env'
      const pathToEnv = path.isAbsolute(env) ? env : path.join(process.cwd(), env)

      const envHash = await this.getEnvContent(pathToEnv)
      await this.updateEnvContents(pathToEnv, Object.assign(envHash, { APP_KEY: key }))

      this.completed('generated', 'unique APP_KEY')
    })
  }
}

module.exports = KeyGenerate
