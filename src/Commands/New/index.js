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
 * This command performs a series of operations
 * to be create a new Adonisjs application.
 *
 * @class NewApp
 */
class NewApp extends BaseCommand {
  /**
   * The command signature required by ace
   *
   * @attribute signature
   * @static
   *
   * @return {String}
   */
  static get signature () {
    return `
    new
    { name : Name of the project directory }
    { --api-only : Scaffold project for api server }
    { --api: Scaffold project for api server }
    { --slim : Scaffold smallest possible Adonisjs application }
    { --blueprint?=@value : Path to github project blueprint }
    { --branch?=@value : Specify git branch for project blueprint }
    { --skip-install : Do not install modules from npm }
    { --yarn : Use yarn over npm for modules installation }
    { --cnpm: Use cnpm over npm for installation }
    { --raw : Disable animations and colored output }
    `
  }

  /**
   * The command description required by ace
   *
   * @attribute description
   *
   * @return {String}
   */
  static get description () {
    return 'Create a new AdonisJs application'
  }

  /**
   * Returns the actual blueprint to be used for
   * cloning the repo. It will go over the cli
   * options and returns the most appropriate
   * one.
   *
   * @method _getBluePrint
   *
   * @param  {Object}      options
   *
   * @return {String}
   *
   * @private
   */
  _getBluePrint (options) {
    /**
     * Use the explicitly defined blueprint
     * over any other options.
     */
    if (options.blueprint) {
      return options.blueprint
    }

    /**
     * If we used the flag --api-only or --api we want
     * to fetch the API blueprint.
     */
    if (options.apiOnly || options.api) {
      return 'adonisjs/adonis-api-app'
    }

    /**
     * If we used the flag --slim we want to fetch
     * the SLIM blueprint.
     */
    if (options.slim) {
      return 'adonisjs/adonis-slim-app'
    }

    /**
     * If none flag has been defiend we fallbacke
     * to the Fullstack blueprint.
     */
    return 'adonisjs/adonis-fullstack-app'
  }

  /**
   * Ensure node version is correct, then make sure app path is
   * empty and finally clone the repo and remove `.git` dir.
   *
   * @method _setupProjectDirectory
   *
   * @param  {Object}               stepsCounter
   * @param  {String}               appPath
   * @param  {Object}               options
   *
   * @return {void}
   *
   * @private
   */
  async _setupProjectDirectory (stepsCounter, appPath, options) {
    await require('../../Services/check-node-version')(stepsCounter)
    await require('../../Services/verify-existing-folder')(appPath, stepsCounter)
    await require('../../Services/clone')(this._getBluePrint(options), appPath, stepsCounter, options.branch)
    await this.removeDir(path.join(appPath, '.git'))
  }

  /**
   * Install dependencies when `skip-install` flag has not been
   * passed
   *
   * @method _installDependencies
   *
   * @param  {Object}             stepsCounter
   * @param  {String}             appPath
   * @param  {Object}             options
   *
   * @return {void}
   *
   * @private
   */
  async _installDependencies (stepsCounter, appPath, options) {
    if (options.skipInstall) {
      return
    }
    await require('../../Services/install')(options.yarn ? 'yarn' : (options.cnpm ? 'cnpm' : 'npm'), stepsCounter)
  }

  /**
   * Copy the `.env` file and generate the app key after installation
   * of modules have been done.
   *
   * @method _postInstallation
   *
   * @param  {Object}          stepsCounter
   * @param  {String}          appPath
   *
   * @return {void}
   *
   * @private
   */
  async _postInstallation (stepsCounter, appPath) {
    await require('../../Services/copy-env-file')(appPath, stepsCounter)
    await require('../../Services/generate-app-key')(stepsCounter)
  }

  /**
   * Prints a message after a new project has been created
   *
   * @method _onBoardForNewProject
   *
   * @param  {String}             appName
   *
   * @return {void}
   *
   * @private
   */
  _onBoardForNewProject (appName) {
    const lines = [
      '',
      '🚀   Successfully created project',
      '👉   Get started with the following commands',
      '',
      `${this.chalk.dim('$')} ${this.chalk.cyan(`cd ${appName}`)}`,
      `${this.chalk.dim('$')} ${this.chalk.cyan('adonis serve --dev')}`,
      ''
    ]

    lines.forEach((line) => {
      console.log(line)
    })
  }

  /**
   * Handle method executed by ace to setup a new app
   *
   * @method handle
   *
   * @param  {String} options.name
   * @param  {Object} options
   *
   * @return {void}
   */
  async handle ({ name }, options) {
    const appPath = path.join(process.cwd(), name)
    const stepsCounter = this.initiateSteps(options.skipInstall ? 5 : 6, options)

    this.invoke(async () => {
      this.dumpAsciiLogo()
      await this._setupProjectDirectory(stepsCounter, appPath, options)

      process.chdir(appPath)

      await this._installDependencies(stepsCounter, appPath, options)
      await this._postInstallation(stepsCounter, appPath)
      this._onBoardForNewProject(name)
    })
  }
}

module.exports = NewApp
