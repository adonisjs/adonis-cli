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

const ERROR_HEADING = `
=============================================
Installation failed due to following error
=============================================`

/**
 * This command performs a series of operations
 * to be create a new Adonisjs application.
 *
 * @class NewApp
 */
class NewApp extends Command {
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
    { --slim : Scaffold smallest possible Adonisjs application }
    { --blueprint?=@value : Path to github project blueprint }
    { --branch?=@value : Specify git branch for project blueprint }
    { --skip-install : Do not install modules from npm }
    { --yarn : Use yarn over npm for modules installation }
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
     * Api only is given preference over full-stack. Ideally
     * a user should never pass flag for both.
     */
    if (options.apiOnly) {
      return 'adonisjs/adonis-api-app'
    }

    /**
     * Fullstack if defined
     */
    if (options.slim) {
      return 'adonisjs/adonis-slim-app'
    }

    /**
     * Fallback to `adonis-fullstack-app`
     */
    return 'adonisjs/adonis-fullstack-app'
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
    const steps = require('./steps')

    const appPath = path.join(process.cwd(), name)
    const blueprint = this._getBluePrint(options)
    const icon = this.icon.bind(this)
    const chalk = this.chalk

    try {
      /**
       * Step 1: Show the ascii logo of AdonisJs
       */
      steps.dumpAsciiLogo(chalk)

      /**
       * Step 2: Make sure supported versions of Node.js and
       *         npm are installed.
       */
      await steps.checkRequirements(chalk, icon)

      /**
       * Step 3: Make sure app doesn't exists already
       */
      await steps.verifyExistingApp(appPath, chalk, icon)

      /**
       * Step 4: Clone the repo to appPath.
       */
      await steps.clone(blueprint, appPath, chalk, icon, options.branch)

      /**
       * Step 5: Remove .git directory from clone repo.
       */
      await this.removeDir(path.join(appPath, '.git'))

      /**
       * Step 6: cd into the app for performing all other actions
       */
      process.chdir(appPath)

      /**
       * Step 7: Install dependencies
       */
      if (!options.skipInstall) {
        await steps.installDependencies(appPath, options.yarn ? 'yarn' : 'npm', chalk, icon)
      }

      /**
       * Step 8: Copy env file
       */
      await steps.copyEnvFile(appPath, this.copy, chalk, icon)

      /**
       * Step 9: Generate APP_SECRET key
       */
      await steps.generateAppKey(chalk, icon)

      /**
       * Step 10: Onboard user
       */
      steps.onBoardUser(name, chalk)
    } catch (error) {
      this.error(ERROR_HEADING)
      console.log(error.message)
      process.exit(1)
    }
  }
}

module.exports = NewApp
