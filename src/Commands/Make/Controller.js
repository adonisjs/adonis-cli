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
 * Make a new HTTP or Ws controller
 *
 * @class MakeController
 * @constructor
 */
class MakeController extends BaseCommand {
  /**
   * The command signature
   *
   * @method signature
   *
   * @return {String}
   */
  static get signature () {
    return `
    make:controller
    { name: Name of the controller }
    { --resource: Create resourceful methods on the controller }
    { --type=@value: The type can be http or ws }
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
    return 'Make a new HTTP or Websocket channel controller'
  }

  /**
   * Returns the resource type for the controller
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
    if (!type || ['ws', 'http'].indexOf(type) <= -1) {
      type = await this
        .on('validate', (value) => !!value)
        .choice('Select controller type', [
          {
            value: 'http',
            name: 'For HTTP requests'
          },
          {
            value: 'ws',
            name: 'For Websocket channel'
          }
        ])
    }

    return type === 'ws' ? 'wsController' : 'httpController'
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
  async handle ({ name }, { type, resource }) {
    await this.invoke(async () => {
      await this.ensureInProjectRoot()
      const resourceType = await this._getResourceType(type)
      await this.generateBlueprint(resourceType, name, { resource })
    })
  }
}

module.exports = MakeController
