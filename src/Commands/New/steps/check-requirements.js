'use strict'

/*
 * adonis-cli
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const pify = require('pify')
const semver = require('semver')
const exec = require('child_process').exec

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
  const nodeVersion = process.version
  let npmVersion = await pify(exec)('npm -v')
  npmVersion = npmVersion.trim()

  const step = stepsCounter.advance('Verifying requirements', 'microscope', 'node & npm')
  step.start()

  if (!semver.satisfies(nodeVersion, '>=8.0.0')) {
    step.error('Unsupported Node.js version', 'x')
    throw new Error(`Unsatisfied Node.js version ${nodeVersion}. Please update Node.js to >= 8.0.0 before you continue`)
  }

  if (!semver.satisfies(npmVersion, '>=3.0.0')) {
    step.error('Unsupported npm version', 'x')
    throw new Error(`Unsatisfied npm version ${npmVersion}. Please update npm to >= 3.0.0 before you continue`)
  }

  step.success('Requirements matched', 'white_check_mark')
}
