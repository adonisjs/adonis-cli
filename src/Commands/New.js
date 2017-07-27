'use strict'

/**
 * adonis-cli
 * @license MIT
 * @copyright Adonis - Harminder Virk <virk@adonisjs.com>
*/

const path = require('path')
const pify = require('pify')
const fs = require('fs-extra')
const BaseCommand = require('./Base')
const exec = require('child_process').exec

/**
 * Command that create a new AdonisJs application.
 *
 * @class New
 * @module Adonis
 * @submodule cli
 * @extends Base
 */
class New extends BaseCommand {

  /**
   * Returns the signature of the command.
   *
   * @readOnly
   * @property signature
   * @return {string}
   */
get signature () {
  return `new {name:Name of your application}
    {--skip-install?:Skip the installation process}
    {--branch?=@value:Branch to be used}
    {--blueprint?=@value:Repository to be used}
    {--yarn?:Use yarn to install dependencies}
    {--npm?:Use npm to install dependencies}
  `
}

  /**
   * Returns the description of the command.
   *
   * @readOnly
   * @property description
   * @return {string}
   */
  get description () {
    return 'Scaffold a new AdonisJs application with the name provided.'
  }

  /**
   * Scaffold a new AdonisJs application by following these steps.
   *
   *  1. Check the Node.js version to ensure that it match the requirements.
   *  2. Verify that the application folder doesn't already exists.
   *  3. Clone the blueprint & branch requested to the applicatin folder.
   *  4. Install all dependencies using yarn or npm
   *  5. Remove the .git folder to have a clean install.
   *  6. Copy the default .env.example to .env
   *  7. Generate a default APP_KEY using ace.
   *
   * @method handle
   * @param  {array} args
   * @param  {object} options
   * @return {void}
   */
  * handle (args, options) {
    this.branch = options.branch || 'master'
    this.blueprint = options.blueprint || 'adonisjs/adonis-app'
    this.applicationName = args.name
    this.applicationPath = path.join(process.cwd(), args.name)
    this.mustUse = null

    if (options.npm) {
      this.mustUse = 'npm'
    } else if (options.yarn) {
      this.mustUse = 'yarn'
    }

    this._dumpAsciiLogo()
    yield this._checkRequirements()
    yield this._verifyApplicationDoesntExist()
    yield this._cloneRepository()

    process.chdir(this.applicationPath)

    if (options['skip-install'] === null) {
      yield this._installDependencies()
    }

    yield this._cleanProjectDirectory()
    yield this._copyEnvironmentFile()

    if (options['skip-install'] === null) {
      yield this._generateSecureKey()
    }

    this.log()
    this.success(`${this.icon('success')} Your application is ready!`)
    this.log()

    this.info(`${this.icon('info')} Follow below instructions to get started`)
    this.log(`$ cd ${this.colors.magenta.bold(args.name)}`)
    this.log(`$ npm install`)
    this.log(`$ npm run serve:dev`)
    this.log()
  }

  /**
   * Verify that the application folder doesn't already exists.
   *
   * @private
   * @method _verifyApplicationDoesntExist
   * @return {void}
   */
  * _verifyApplicationDoesntExist () {
    try {
      yield pify(fs.access)(this.applicationPath, (fs.constants || fs).F_OK)
      this.error(`${this.icon('error')} The directory "${this.applicationName}" already exists!`)
      process.exit(0)
    } catch (e) {
      if (e.code !== 'ENOENT') {
          this.error(`${this.icon('error')} An error occured while trying to access "${this.applicationPath}" directory`)
          this.error(e.message)
          process.exit(0)
      }
    }
  }

  /**
   * Clone the AdonisJs blueprint repository with
   * the given branch.
   *
   * @private
   * @method _cloneRepository
   * @return {void}
   */
  * _cloneRepository () {
    const branch = this.colors.magenta.bold(this.branch)
    const blueprint = this.colors.magenta.bold(this.blueprint)

    this._startSpinner(
      this.colors.blue(`Cloning ${branch} branch of ${blueprint} blueprint`)
    )

    try {
      yield pify(exec)(`git clone -b ${this.branch} --single-branch https://github.com/${this.blueprint}.git ${this.applicationPath}`)
      this._stopSpinner()
      this.log()
      this.completed('clone', 'Repository cloned')
    } catch (e) {
      this.log()
      this.error(`${this.icon('error')} An error occured while trying to clone ${branch} version of ${blueprint} blueprint.`)
      this.error(e.message)
      process.exit(0)
    }
  }

  /**
   * Install all dependencies of the application.
   *
   * @private
   * @method _installDependencies
   * @return {void}
   */
  * _installDependencies () {
    let tool = 'npm'

    if (!this.mustUse && (yield this._hasYarnInstalled())) {
      this.info(`${this.icon('info')} Yarn has been detected in your system!`)
      if (yield this.confirm('Do you want to use yarn instead of npm?', false).print()) {
        tool = 'yarn'
      }
    } else if (this.mustUse) {
      tool = this.mustUse
    }

    const command = (tool === 'yarn') ? 'yarn' : 'npm install'

    this._startSpinner(
      this.colors.blue(`Installing dependencies using ${tool}`)
    )

    try {
      yield pify(exec)(command)
    } catch (e) {
      this._stopSpinner()
      this.error(`${this.icon('error')} Installing dependencies failed!`)
      this.error(e.message)
      process.exit(0)
    }

    this._stopSpinner()
    this.log()
    this.completed('install', 'Dependencies installed')
  }

  /**
   * Clean the project directory by removing the .git folder.
   *
   * @private
   * @method _cleanProjectDirectory
   * @return {void}
   */
  * _cleanProjectDirectory () {
    try {
      yield pify(fs.remove)(path.join(this.applicationPath, '.git'))
      this.completed('clean', 'Repository cleaned')
    } catch (e) {
      this.failed('clean', 'Sorry we failed at removing the .git folder')
      this.error(e.message)
    }
  }

  /**
   * Copy the default .env.example to .env.
   *
   * @private
   * @method _copyEnvironmentFile
   * @return {void}
   */
  * _copyEnvironmentFile () {
    try {
      yield pify(fs.copy)(
        path.join(this.applicationPath, '.env.example'),
        path.join(this.applicationPath, '.env')
      )
      this.completed('copy', 'Default environment variables copied')
    } catch (e) {
      this.failed('copy', 'Sorry we failed at copying environment variable')
      this.error(e.message)
    }
  }

  /**
   * Generate a default APP_KEY.
   *
   * @private
   * @method _generateSecureKey
   * @return {void}
   */
  * _generateSecureKey () {
    try {
      yield pify(exec)('node ace key:generate')
      this.completed('setting', 'APP_KEY set')
    } catch (e) {
      this.failed('setting', 'Sorry we failed at setting up the APP_KEY')
      this.error(e.message)
    }
  }

}

module.exports = New
