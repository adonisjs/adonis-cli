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
const pify = require('pify')
const exec = require('child_process').exec
const Spinner = require('cli-spinner').Spinner

/**
 * Install dependencies from npm or yarn. The installation
 * tool must be installed on user machine
 *
 * @method
 *
 * @param  {String} appPath
 * @param  {String} via
 * @param  {Object} chalk
 * @param  {Function} icon
 *
 * @return {void}
 */
module.exports = async function (appPath, via, chalk, icon) {
  const command = via === 'npm' ? 'npm install' : 'yarn'
  const name = path.basename(appPath)
  let spinner = new Spinner(`${chalk.cyan(`${via}: Installing dependencies for ${chalk.magenta(name)}. May take a while`)}`)
  spinner.start()

  try {
    await pify(exec)(command)
    spinner.stop(true)
    console.log(chalk.green(`${icon('success')} ${via}: Dependencies installed`))
  } catch (error) {
    spinner.stop(true)
    console.log(chalk.red(`${icon('error')} ${via}: Installation failed`))
    console.log(`   We suggest cd into ${chalk.cyan(name)} and re-run ${chalk.cyan(command)}`)
    throw error
  }
}
