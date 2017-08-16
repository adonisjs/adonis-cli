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
const exec = require('child_process').exec
const Spinner = require('cli-spinner').Spinner

/**
 * Install dependencies from npm or yarn. The installation
 * tool must be installed on user machine
 *
 * @method
 *
 * @param  {String} via
 * @param  {Object} chalk
 * @param  {Function} icon
 *
 * @return {void}
 */
module.exports = async function (via, packageName, chalk, icon) {
  const command = via === 'npm' ? `npm install --save ${packageName}` : `yarn add ${packageName}`
  let spinner = new Spinner(`${chalk.cyan(`${via}: Installing ${chalk.magenta(packageName)}`)}`)
  spinner.start()

  try {
    await pify(exec)(command)
    spinner.stop(true)
    console.log(chalk.green(`${icon('success')} ${via}: Installed ${packageName}`))
  } catch (error) {
    spinner.stop(true)
    console.log(chalk.red(`${icon('error')} ${via}: Installation failed`))
    throw error
  }
}
