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
const debug = require('debug')('adonis:cli')

const options = {
  appDir: 'app',
  dirs: {
    httpControllers: 'Controllers/Http',
    wsControllers: 'Controllers/Ws',
    models: 'Models',
    traits: 'Models/Traits',
    hooks: 'Models/Hooks',
    listeners: 'Listeners',
    exceptions: 'Exceptions',
    middleware: 'Middleware',
    commands: 'Commands',
    views: 'resources/views',
    migrations: 'database/migrations',
    seeds: 'database/seeds',
    providers: 'providers'
  }
}

class MakeBase extends BaseCommand {
  /**
   * Generates the blueprint for a given resources
   * using pre-defined template
   *
   * @method generateBlueprint
   *
   * @param  {String}         templateFor
   * @param  {String}         name
   * @param  {Object}         flags
   *
   * @return {void}
   */
  async generateBlueprint (templateFor, name, flags) {
    const generators = require('../../Generators')

    options.appRoot = options.appRoot || process.cwd()

    debug('blueprint options %j', options)

    const templateFile = path.join(__dirname, '../../Generators/templates', `${templateFor}.mustache`)

    const filePath = generators[templateFor].getFilePath(name, options)
    const data = generators[templateFor].getData(path.basename(name), flags)

    debug('blueprint file path %s', filePath)
    debug('blueprint data %j', data)

    const templateContents = await this.readFile(templateFile, 'utf-8')
    await this.generateFile(filePath, templateContents, data)

    const createdFile = filePath.replace(process.cwd(), '').replace(path.sep, '')
    console.log(`${this.icon('success')} ${this.chalk.green('create')}  ${createdFile}`)

    return { file: createdFile, namespace: this.getNamespace(createdFile, templateFor) }
  }

  /**
   * Returns namespace for a given resource
   *
   * @method getNamespace
   *
   * @param  {String}     filePath
   * @param  {String}     namespaceFor
   *
   * @return {String}
   */
  getNamespace (filePath, namespaceFor) {
    const dir = options.dirs[namespaceFor] || options.dirs[`${namespaceFor}s`]
    return `App/${dir}/${path.basename(filePath).replace('.js', '')}`
  }

  /**
   * Print lines to the console
   *
   * @method printInstructions
   *
   * @param  {Array}          lines
   *
   * @return {void}
   */
  printInstructions (heading, steps) {
    console.log(
      ['', `👉   ${heading}`, '']
        .concat(steps.map((line) => `${this.chalk.dim('→')} ${line}`))
        .concat([''])
        .join('\n')
    )
  }
}

module.exports = MakeBase
