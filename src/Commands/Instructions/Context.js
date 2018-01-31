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
const _ = require('lodash')
const ace = require('../../../lib/ace')

class Context {
  constructor (command, helpers) {
    this.command = command
    this.helpers = helpers
    this.appDir = path.join(this.helpers.appRoot(), 'app')
  }

  /**
   * Make config file using a template
   *
   * @method makeConfig
   * @async
   *
   * @param  {String}   fileName
   * @param  {String}   templatePath
   * @param  {Object}   data
   *
   * @return {void}
   */
  async makeConfig (fileName, templatePath, data) {
    const configFile = path.join(this.helpers.configPath(), fileName)
    const template = await this.command.readFile(templatePath, 'utf-8')
    await this.command.generateFile(configFile, template, data)
  }

  /**
   * Calls ace command
   *
   * @method callCommand
   * @async
   *
   * @param  {String}    name
   * @param  {Object}    args
   * @param  {Object}    options
   *
   * @return {void}
   */
  callCommand (name, args, options) {
    return ace.call(name, args, options)
  }

  /**
   * Copy file from one destination to other
   *
   * @method copy
   *
   * @param  {String} fromFile
   * @param  {String} toFile
   * @param  {Object} [options]
   *
   * @return {void}
   */
  copy (fromFile, toFile, options) {
    return this.command.copy(fromFile, toFile, _.merge({}, { overwrite: false, errorOnExist: true }, options))
  }
}

module.exports = Context
