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
const pluralize = require('pluralize')
const generators = exports = module.exports = {}

generators.httpController = {
  /**
   * Returns the data to be sent to the controller
   * template
   *
   * @method getData
   *
   * @param  {String} name
   * @param  {Object} flags
   *
   * @return {Object}
   */
  getData (name, flags) {
    return {
      name: this.getFileName(name),
      resource: !!flags.resource
    }
  },

  /**
   * Returns file name for controller.
   *
   * @method getFileName
   *
   * @param  {String}    name
   *
   * @return {String}
   */
  getFileName (name) {
    name = name.replace(/controller/ig, '')
    return `${pluralize.singular(_.upperFirst(_.camelCase(name)))}Controller`
  },

  /**
   * Returns path to the controller file
   *
   * @method getFilePath
   *
   * @param  {String}    name
   * @param  {Object}    options
   *
   * @return {String}
   */
  getFilePath (name, options) {
    return path.join(options.appRoot, options.appDir, options.dirs.httpControllers, this.getFileName(name)) + '.js'
  }
}

generators.model = {
  /**
   * Returns data object for the model
   * template file
   *
   * @method getData
   *
   * @param  {String} name
   *
   * @return {Object}
   */
  getData (name) {
    return {
      name: this.getFileName(name)
    }
  },

  /**
   * Returns the model file name
   *
   * @method getFileName
   *
   * @param  {String}    name
   *
   * @return {String}
   */
  getFileName (name, appPath) {
    name = name.replace(/model/ig, '')
    return `${pluralize.singular(_.upperFirst(_.camelCase(name)))}`
  },

  /**
   * Returns file path to the model file
   *
   * @method getFilePath
   *
   * @param  {String}    name
   * @param  {Object}    options
   *
   * @return {String}
   */
  getFilePath (name, options) {
    return path.join(options.appRoot, options.appDir, options.dirs.models, this.getFileName(name)) + '.js'
  }
}

generators.middleware = {
  /**
   * Returns data for the middleware template
   *
   * @method getData
   *
   * @param  {String} name
   *
   * @return {Object}
   */
  getData (name, flags) {
    return {
      name: this.getFileName(name),
      http: flags.type === 'http' || flags.type === 'both',
      ws: flags.type === 'ws' || flags.type === 'both'
    }
  },

  /**
   * Returns file name for the middleware file
   *
   * @method getFileName
   *
   * @param  {String}    name
   *
   * @return {String}
   */
  getFileName (name, appPath) {
    name = name.replace(/middleware/ig, '')
    return `${pluralize.singular(_.upperFirst(_.camelCase(name)))}Middleware`
  },

  /**
   * Returns file path for the middleware file
   *
   * @method getFilePath
   *
   * @param  {String}    name
   * @param  {Object}    options
   *
   * @return {String}
   */
  getFilePath (name, options) {
    return path.join(options.appRoot, options.appDir, options.dirs.middleware, this.getFileName(name)) + '.js'
  }
}

generators.hook = {
  /**
   * Returns data for the hook template
   *
   * @method getData
   *
   * @param  {String} name
   * @param  {Object} flags
   *
   * @return {Object}
   */
  getData (name, flags) {
    return {
      name: this.getFileName(name),
      method: flags.method && typeof (flags.method) === 'string' ? flags.method : 'method'
    }
  },

  /**
   * Returns file name for the hook file
   *
   * @method getFileName
   *
   * @param  {String}    name
   *
   * @return {String}
   */
  getFileName (name, appPath) {
    name = name.replace(/hook/ig, '')
    return `${pluralize.singular(_.upperFirst(_.camelCase(name)))}Hook`
  },

  /**
   * Returns file path for the hook file
   *
   * @method getFilePath
   *
   * @param  {String}    name
   * @param  {Object}    options
   *
   * @return {String}
   */
  getFilePath (name, options) {
    return path.join(options.appRoot, options.appDir, options.dirs.hooks, this.getFileName(name)) + '.js'
  }
}

generators.view = {
  /**
   * Returns data for the view template
   *
   * @method getData
   *
   * @param  {String} name
   * @param  {Object} flags
   *
   * @return {Object}
   */
  getData (name, flags) {
    return {
      layout: flags.layout && typeof (flags.layout) === 'string' ? flags.layout : null
    }
  },

  /**
   * Returns file name for the view file
   *
   * @method getFileName
   *
   * @param  {String}    name
   *
   * @return {String}
   */
  getFileName (name, appPath) {
    return _.toLower(name).replace(/view/ig, '').replace(/\./g, '/')
  },

  /**
   * Returns file path for the hook file
   *
   * @method getFilePath
   *
   * @param  {String}    name
   * @param  {Object}    options
   *
   * @return {String}
   */
  getFilePath (name, options) {
    return path.join(options.appRoot, options.dirs.views, this.getFileName(name)) + '.edge'
  }
}

generators.command = {
  /**
   * Returns data for the command template
   *
   * @method getData
   *
   * @param  {String} name
   * @param  {Object} flags
   *
   * @return {Object}
   */
  getData (name, flags) {
    return {
      name: this.getFileName(name),
      commandName: _.snakeCase(this.getFileName(name)).replace(/_/g, ':')
    }
  },

  /**
   * Returns file name for the command file
   *
   * @method getFileName
   *
   * @param  {String}    name
   *
   * @return {String}
   */
  getFileName (name, appPath) {
    name = name.replace(/command/ig, '')
    return pluralize.singular(_.upperFirst(_.camelCase(name)))
  },

  /**
   * Returns file path for the command file
   *
   * @method getFilePath
   *
   * @param  {String}    name
   * @param  {Object}    options
   *
   * @return {String}
   */
  getFilePath (name, options) {
    return path.join(options.appRoot, options.appDir, options.dirs.commands, this.getFileName(name)) + '.js'
  }
}
