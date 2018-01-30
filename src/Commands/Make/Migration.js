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
 * Make a new migration file
 *
 * @class MakeMigration
 * @constructor
 */
class MakeMigration extends BaseCommand {
  /**
   * Command signature required by ace
   *
   * @method signature
   *
   * @return {String}
   */
  static get signature () {
    return `
    make:migration
    { name: Name of migration file, current timestamp will be prepended to the name }
    { --action?=@value : Choose an action to \`create\` or \`select\` a table }
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
    return 'Create a new migration file'
  }

  /**
   * Returns the migration action
   *
   * @method _getActionType
   *
   * @param  {String}       action
   *
   * @return {String}
   */
  async _getActionType (action) {
    if (!action || ['create', 'select'].indexOf(action) <= -1) {
      action = await this.choice('Choose an action', [
        {
          value: 'create',
          name: 'Create table'
        },
        {
          value: 'select',
          name: 'Select table'
        }
      ])
    }

    return action
  }

  /**
   * Method to be called when this command is executed
   *
   * @method handle
   *
   * @param  {String} options.name
   * @param  {String} options.action
   *
   * @return {void|String} - Returns abs path to created file when command
   *                         is not executed by ace.
   */
  async handle ({ name }, { action }) {
    await this.invoke(async () => {
      await this.ensureInProjectRoot()

      const actionType = await this._getActionType(action)
      await this.generateBlueprint('schema', name, { action: actionType })
    })
  }
}

module.exports = MakeMigration
