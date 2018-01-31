'use strict'

/**
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
 * to be create a new addon folder.
 *
 * @class NewAddon
 */
class NewAddon extends BaseCommand {
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
    addon
    { name : Name of the addon directory }
    { --skip-install : Do not install modules from npm }
    { --yarn : Use yarn over npm for modules installation }
    { --raw : Disable animations and colored output }
    { --dev: Install the dev blueprint }
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
    return 'Create a new AdonisJs addon'
  }

  /**
   * Ensure node version is correct, then make sure app path is
   * empty and finally clone the repo and remove `.git` dir.
   *
   * @method _setupProjectDirectory
   *
   * @param  {Object}               stepsCounter
   * @param  {String}               blueprint
   * @param  {String}               appPath
   * @param  {Object}               options
   *
   * @return {void}
   *
   * @private
   */
  async _setupProjectDirectory (stepsCounter, blueprint, appPath, options) {
    await require('../../Services/check-node-version')(stepsCounter)
    await require('../../Services/verify-existing-folder')(appPath, stepsCounter)
    await require('../../Services/clone')(blueprint, appPath, stepsCounter, options.branch)
    await this.removeDir(path.join(appPath, '.git'))
  }

  /**
   * Prints a message after a new project has been created
   *
   * @method _onBoardForNewAddon
   *
   * @return {void}
   *
   * @private
   */
  _onBoardForNewAddon () {
    const lines = [
      '',
      '🚀   Addon created successfully',
      '👉   Get started by clicking the following link',
      '',
      `${this.chalk.blue('https://adonisjs.com/recipes/creating-addons')}`,
      ''
    ]
    lines.forEach((line) => (console.log(line)))
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
    await require('../../Services/install')(options.yarn ? 'yarn' : 'npm', stepsCounter)
  }

  /**
   * Invoked by ace
   *
   * @method handle
   *
   * @param  {Object} args
   * @param  {Object} options
   *
   * @return {void}
   */
  async handle ({ name }, options) {
    const blueprint = 'adonisjs/adonis-addon'
    const addonPath = path.join(process.cwd(), name)
    const stepsCounter = this.initiateSteps(options.skipInstall ? 3 : 4, options)

    if (options.dev) {
      options.branch = 'develop'
    }

    await this.invoke(async () => {
      this.dumpAsciiLogo()

      await this._setupProjectDirectory(stepsCounter, blueprint, addonPath, options)
      process.chdir(addonPath)

      await this._installDependencies(stepsCounter, addonPath, options)
      this._onBoardForNewAddon()
    })
  }
}

module.exports = NewAddon
