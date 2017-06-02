'use strict'

/**
 * adonis-installer
 * @license MIT
 * @copyright Adonis - Harminder Virk <virk@adonisjs.com>
*/

const pify = require('pify')
const which = require('which')
const semver = require('semver')
const Command = use('Adonis/Src/Command')
const exec = require('child_process').exec
const Spinner = require('cli-spinner').Spinner

/**
 * Base Command of the Adonis-CLI.
 *
 * @class Base
 * @module Adonis
 * @submodule cli
 */
class Base extends Command {
  /**
   * Constructor.
   *
   * @constructor
   * @return {void}
   */
  constructor () {
    super()

    this.spinners = []
  }

  /**
   * Check the Node.js version to ensure that it match the requirements.
   *
   * @protected
   * @method _checkRequirements
   * @return {void}
   */
  * _checkRequirements (yarnToolRequested) {
    const nodeVersion = process.version
    let error = false

    if (!semver.satisfies(nodeVersion, '>=4.0.0')) {
      this.error(`${this.icon('error')} Your current Node.js version doesn't match AdonisJs requirements.`)
      this.error(`${this.icon('info')} Please update your Node.js installation to >= 4.0.0 before continue.`)
      error = true
    }

    if (yarnToolRequested) {
      if (!this._hasYarnInstalled()) {
        this.error(`${this.icon('error')} Yarn dependency tool is not installed.`)
        this.error(`${this.icon('info')} Please install yarn before continue.`)
        error = true
      }
    } else {
      let npmVersion
      // retrieve npm version.
      try {
        npmVersion = yield pify(exec)('npm -v')
      } catch (e) {
        // set npmVersion to empty string if npm is not installed
        npmVersion = ''
      }

      if (!semver.satisfies(npmVersion, '>=3.0.0')) {
        this.error(`${this.icon('error')} Your current npm version doesn't match AdonisJs requirements.`)
        this.error(`${this.icon('info')} Please update your npm installation to >= 3.0.0 before continue.`)
        error = true
      }
    }

    if (error) {
      process.exit(0)
    }

    this.success(`${this.icon('success')} Your current Node.js & ${yarnToolRequested ? 'yarn' : 'npm'} version match the AdonisJs requirements!`)
  }

  /**
   * Starts a spinner.
   *
   * @protected
   * @method _startSpinner
   * @return {void}
   */
  _startSpinner (text, token) {
    token = token || 'default'

    this.spinners[token] = new Spinner(text)
    this.spinners[token].setSpinnerString(18)
    this.spinners[token].start()
  }

  /**
   * Stops a spinner.
   *
   * @protected
   * @method _stopSpinner
   * @return {void}
   */
  _stopSpinner (token) {
    token = token || 'default'
    this.spinners[token].stop()
  }

  /**
   * Detects if yarn is installed.
   *
   * @protected
   * @method _hasYarnInstalled
   * @return {boolean}
   */
  * _hasYarnInstalled () {
    try {
      yield pify(which)('yarn')
      return true
    } catch (e) {}

    return false
  }

  /**
   * Dumps the AdonisJs ASCII logo to the stdout.
   *
   * @protected
   * @method _dumpAsciiLogo
   * @return {void}
   */
  _dumpAsciiLogo () {
    this.log(
      this.colors.green("    _       _             _         _     \n   / \\   __| | ___  _ __ (_)___    | |___ \n  / _ \\ / _` |/ _ \\| '_ \\| / __|_  | / __|\n / ___ \\ (_| | (_) | | | | \\__ \\ |_| \\__ \\\n/_/   \\_\\__,_|\\___/|_| |_|_|___/\\___/|___/\n")
    )
  }
}

module.exports = Base
