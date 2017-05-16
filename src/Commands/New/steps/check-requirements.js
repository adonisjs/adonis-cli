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
 * @param  {Object} chalk
 * @param  {Function} icon
 *
 * @return {void}
 */
module.exports = async function (chalk, icon) {
  const nodeVersion = process.version
  const npmVersion = await pify(exec)('npm -v')

  if (!semver.satisfies(nodeVersion, '>=7.0.0')) {
    console.log(chalk.red(`${icon('error')} Your current Node.js version doesn't match AdonisJs requirements.`))
    console.log(chalk.red(`${icon('info')} Please update your Node.js installation to >= 7.0.0 before continue.`))
    throw new Error(`Unsatisfied Node.js version ${nodeVersion}`)
  }

  if (!semver.satisfies(npmVersion, '>=3.0.0')) {
    console.log(chalk.red(`${icon('error')} Your current npm version doesn't match AdonisJs requirements.`))
    console.log(chalk.red(`${icon('info')} Please update your npm installation to >= 3.0.0 before continue.`))
    throw new Error(`Unsatisfied npm version ${nodeVersion}`)
  }

  console.log(chalk.green(`${icon('success')} Your current Node.js & npm version match the AdonisJs requirements!`))
}
