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
    const baseName = path.basename(name)
    const normalizedName = name.replace(baseName, this.getFileName(baseName))
    return path.join(options.appRoot, options.appDir, options.dirs.httpControllers, normalizedName) + '.js'
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
    const baseName = path.basename(name)
    const normalizedName = name.replace(baseName, this.getFileName(baseName))
    return path.join(options.appRoot, options.appDir, options.dirs.models, normalizedName) + '.js'
  }
}

generators.trait = {
  /**
   * Returns data object for the trait
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
   * Returns the trait file name
   *
   * @method getFileName
   *
   * @param  {String}    name
   *
   * @return {String}
   */
  getFileName (name, appPath) {
    name = name.replace(/trait/ig, '')
    return `${pluralize.singular(_.upperFirst(_.camelCase(name)))}`
  },

  /**
   * Returns file path to the trait file
   *
   * @method getFilePath
   *
   * @param  {String}    name
   * @param  {Object}    options
   *
   * @return {String}
   */
  getFilePath (name, options) {
    const baseName = path.basename(name)
    const normalizedName = name.replace(baseName, this.getFileName(baseName))
    return path.join(options.appRoot, options.appDir, options.dirs.traits, normalizedName) + '.js'
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
    return `${pluralize.singular(_.upperFirst(_.camelCase(name)))}`
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
    const baseName = path.basename(name)
    const normalizedName = name.replace(baseName, this.getFileName(baseName))
    return path.join(options.appRoot, options.appDir, options.dirs.middleware, normalizedName) + '.js'
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
    const baseName = path.basename(name)
    const normalizedName = name.replace(baseName, this.getFileName(baseName))
    return path.join(options.appRoot, options.appDir, options.dirs.hooks, normalizedName) + '.js'
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
    const baseName = path.basename(name)
    const normalizedName = name.replace(baseName, this.getFileName(baseName))
    return path.join(options.appRoot, options.appDir, options.dirs.commands, normalizedName) + '.js'
  }
}

generators.schema = {
  /**
   * Returns data for the migration schema template
   *
   * @method getData
   *
   * @param  {String} name
   * @param  {Object} flags
   *
   * @return {Object}
   */
  getData (name, flags) {
    name = this.getFileName(name)
    return {
      create: flags.action === 'create',
      table: _.snakeCase(pluralize(name.replace('Schema', ''))),
      name: name
    }
  },

  /**
   * Returns file name for the schema migration file
   *
   * @method getFileName
   *
   * @param  {String}    name
   *
   * @return {String}
   */
  getFileName (name, appPath) {
    name = name.replace(/schema|table/ig, '')
    return `${_.upperFirst(_.camelCase(name))}Schema`
  },

  /**
   * Returns file path for the schema migration file
   *
   * @method getFilePath
   *
   * @param  {String}    name
   * @param  {Object}    options
   *
   * @return {String}
   */
  getFilePath (name, options) {
    const fileName = `${new Date().getTime()}_${_.snakeCase(this.getFileName(name))}`
    return path.join(options.appRoot, options.dirs.migrations, fileName) + '.js'
  }
}

generators.listener = {
  /**
   * Returns data for the listener template
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
   * Returns file name for the listener file
   *
   * @method getFileName
   *
   * @param  {String}    name
   *
   * @return {String}
   */
  getFileName (name, appPath) {
    name = name.replace(/listener/ig, '')
    return `${_.upperFirst(_.camelCase(name))}`
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
    const baseName = path.basename(name)
    const normalizedName = name.replace(baseName, this.getFileName(baseName))
    return path.join(options.appRoot, options.appDir, options.dirs.listeners, normalizedName) + '.js'
  }
}

generators.exceptionHandler = {
  /**
   * Returns data for the exception handler template
   *
   * @method getData
   *
   * @return {Object}
   */
  getData (name, flags) {
    return flags || {}
  },

  /**
   * Returns file name for the exception handler file
   *
   * @return {String}
   */
  getFileName () {
    return 'Handler'
  },

  /**
   * Returns file path for the exception handler file
   *
   * @method getFilePath
   *
   * @param  {String}    name
   * @param  {Object}    options
   *
   * @return {String}
   */
  getFilePath (name, options) {
    const baseName = path.basename(name)
    const normalizedName = name.replace(baseName, this.getFileName(baseName))
    return path.join(options.appRoot, options.appDir, options.dirs.exceptions, normalizedName) + '.js'
  }
}

generators.seed = {
  /**
   * Returns data object for the seed
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
   * Returns the seed file name
   *
   * @method getFileName
   *
   * @param  {String}    name
   *
   * @return {String}
   */
  getFileName (name, appPath) {
    name = name.replace(/seed(er)?/ig, '')
    return `${pluralize.singular(_.upperFirst(_.camelCase(name)))}Seeder`
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
    const baseName = path.basename(name)
    const normalizedName = name.replace(baseName, this.getFileName(baseName))
    return path.join(options.appRoot, options.dirs.seeds, normalizedName) + '.js'
  }
}

generators.wsController = {
  /**
   * Returns the data to be sent to the controller
   * template
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
    const baseName = path.basename(name)
    const normalizedName = name.replace(baseName, this.getFileName(baseName))
    return path.join(options.appRoot, options.appDir, options.dirs.wsControllers, normalizedName) + '.js'
  }
}

generators.exception = {
  /**
   * Returns the data to be sent to the exception
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
      name: this.getFileName(name)
    }
  },

  /**
   * Returns file name for exception class.
   *
   * @method getFileName
   *
   * @param  {String}    name
   *
   * @return {String}
   */
  getFileName (name) {
    name = name.replace(/exception/ig, '')
    return `${pluralize.singular(_.upperFirst(_.camelCase(name)))}Exception`
  },

  /**
   * Returns path to the exception file
   *
   * @method getFilePath
   *
   * @param  {String}    name
   * @param  {Object}    options
   *
   * @return {String}
   */
  getFilePath (name, options) {
    const baseName = path.basename(name)
    const normalizedName = name.replace(baseName, this.getFileName(baseName))
    return path.join(options.appRoot, options.appDir, options.dirs.exceptions, normalizedName) + '.js'
  }
}
