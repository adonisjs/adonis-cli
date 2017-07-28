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
   * Pushes instructions for http
   *
   * @method _pushHttpInstructions
   *
   * @param  {Array}            lines
   * @param  {String}            namespace
   *
   * @return {void}
   *
   * @private
   */
  _pushHttpInstructions (lines, namespace) {
    lines.push(`${lines.length - 1}. Open ${this.chalk.cyan('start/kernel.js')} file`)
    lines.push(`${lines.length - 1}. Register ${this.chalk.cyan(namespace)} under global or named middleware`)
  }

  /**
   * Pushes instructions for ws
   *
   * @method _pushWsInstructions
   *
   * @param  {Array}            lines
   * @param  {String}            namespace
   *
   * @return {void}
   *
   * @private
   */
  _pushWsInstructions (lines, namespace) {
    lines.push(`${lines.length - 1}. Open ${this.chalk.cyan('start/ws.js')} file`)
    lines.push(`${lines.length - 1}. Register ${this.chalk.cyan(namespace)} under global or named middleware`)
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
    try {
      await this.ensureInProjectRoot()
      const resourceType = await this._getResourceType(type)
      const { namespace } = await this.generateBlueprint('middleware', name, { type: resourceType })

      const lines = ['Register middleware as follows', '']

      /**
       * Push instructions for http if resource type was
       * http or both
       */
      if (resourceType === 'both' || resourceType === 'http') {
        this._pushHttpInstructions(lines, namespace)
      }

      /**
       * Push instructions for ws if resource type was
       * ws or both
       */
      if (resourceType === 'both' || resourceType === 'ws') {
        this._pushWsInstructions(lines, namespace)
      }

      this.printInstructions(lines)
    } catch ({ message }) {
      this.error(message)
    }
  }
}

module.exports = MakeMiddleware
