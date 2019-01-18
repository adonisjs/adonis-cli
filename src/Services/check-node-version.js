'use strict'

/*
 * adonis-cli
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const semver = require('semver')
const requiredNodeVersion = '>=8.0.0'
const requiredNodeVersionNumber = 8
const requiredNpmVersion = '>=3.0.0'
const requiredNpmVersionNumber = 3

/**
 * This step checks the Node.js and npm version
 * installed on user machine. It will print
 * some messages on the console but also
 * throws an exception to abort the
 * process
 *
 * @async
 *
 * @param  {Object} stepsCounter
 *
 * @return {void}
 */
module.exports = async function (stepsCounter) {
  const step = stepsCounter.advance('Verifying requirements', 'microscope', 'node & npm')
  step.start()

  /**
   * Verify Node.js version.
   *
   * Uses `semver.parse` instead of `semver.satisfies` to support prereleases
   * version of Node.js.
   */
  const nodeVersion = process.version
  if (semver.parse(nodeVersion).major < requiredNodeVersionNumber) {
    step.error('Unsupported Node.js version', 'x')
    throw new Error(`Unsatisfied Node.js version ${nodeVersion}. Please update Node.js to ${requiredNodeVersion} before you continue`)
  }

  /**
   * Verify npm version.
   *
   * Uses `semver.parse` instead of `semver.satisfies` to support prereleases
   * version of npm.
   */
  const npmVersion = (await require('./exec')('npm -v')).trim()
  if (semver.parse(npmVersion).major < requiredNpmVersionNumber) {
    step.error('Unsupported npm version', 'x')
    throw new Error(`Unsatisfied npm version ${npmVersion}. Please update npm to ${requiredNpmVersion} before you continue`)
  }

  step.success('Requirements matched')
}
