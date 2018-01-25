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
    seeds: 'database/seeds'
  }
}

class MakeBase extends Command {
  /**
   * Ensures the command is executed within the
   * project root
   *
   * @method ensureInProjectRoot
   *
   * @return {void}
   */
  async ensureInProjectRoot () {
    const acePath = path.join(process.cwd(), 'ace')
    const exists = await this.pathExists(acePath)

    if (!exists) {
      throw new Error(`Make sure you are inside an Adonisjs app to run ${this.constructor.commandName} command`)
    }
  }

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

    const templateFile = path.join(__dirname, '../../Generators/templates', `${templateFor}.mustache`)

    const filePath = generators[templateFor].getFilePath(name, options)
    const data = generators[templateFor].getData(path.basename(name), flags)

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
  printInstructions (lines) {
    const boxen = require('boxen')

    console.log(boxen(lines.join('\n'), {
      dimBorder: true,
      align: 'left',
      padding: {
        left: 8,
        right: 8
      },
      borderColor: 'yellow'
    }))
  }
}

module.exports = MakeBase
