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
 * Make a new HTTP or Ws middleware
 *
 * @class MakeMiddleware
 * @constructor
 */
class MakeMiddleware extends BaseCommand {
  /**
   * The command signature
   *
   * @method signature
   *
   * @return {String}
   */
  static get signature () {
    return `
    make:middleware
    { name: Name of the middleware }
    { --type=@value: The type can be http, ws or both }
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
    return 'Make a new HTTP or Ws Middleware'
  }

  /**
   * Returns the resource type for the middleware
   *
   * @method _getResourceType
   *
   * @param  {String}         type
   *
   * @return {String}
   *
   * @private
   */
  async _getResourceType (type) {
    if (!type || ['ws', 'http', 'both'].indexOf(type) <= -1) {
      type = await this
        .on('validate', (value) => !!value)
        .choice('Select middleware type', [
          {
            name: 'For HTTP requests',
            value: 'http'
          },
          {
            name: 'For Websocket requests',
            value: 'ws'
          },
          {
            name: 'For both HTTP and Websocket requests',
            value: 'both'
          }
        ])
    }

    return type
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
  async handle ({ name }, { type }) {
    await this.invoke(async () => {
      await this.ensureInProjectRoot()

      const resourceType = await this._getResourceType(type)
      const { namespace } = await this.generateBlueprint('middleware', name, { type: resourceType })

      const steps = []

      /**
       * Push instructions for http if resource type was
       * http or both
       */
      if (resourceType === 'both' || resourceType === 'http') {
        steps.push(`Open ${this.chalk.cyan('start/kernel.js')} file`)
        steps.push(`Register ${this.chalk.cyan(namespace)} under global or named middleware`)
      }

      /**
       * Push instructions for ws if resource type was
       * ws or both
       */
      if (resourceType === 'both' || resourceType === 'ws') {
        steps.push(`Open ${this.chalk.cyan('start/ws.js')} file`)
        steps.push(`Register ${this.chalk.cyan(namespace)} under global or named middleware`)
      }

      this.printInstructions('Register middleware as follows', steps)
    })
  }
}

module.exports = MakeMiddleware
