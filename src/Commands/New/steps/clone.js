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
 * This module clones a given github repo and branch.
 *
 * @method
 *
 * @param  {String} blueprint
 * @param  {String} appPath
 * @param  {Object} chalk
 * @param  {Function} icon
 * @param  {String} [branch = null]
 *
 * @return {void}
 */
module.exports = async function (blueprint, appPath, chalk, icon, branch = null) {
  const name = path.basename(appPath)

  const spinner = new Spinner(`${chalk.cyan(`Cloning ${blueprint} to ${name}`)}`)
  spinner.start()

  let cloneCommand = 'git clone --depth=1'

  /**
   * Add branch flag when branch is defined
   */
  if (branch) {
    cloneCommand = `${cloneCommand}  --branch ${branch}`
  }

  // complete the clone command
  cloneCommand = `${cloneCommand} https://github.com/${blueprint}.git ${appPath}`

  try {
    await pify(exec)(cloneCommand)
    spinner.stop(true)
    console.log(chalk.green(`${icon('success')} Cloned [${blueprint}]`))
  } catch (error) {
    spinner.stop(true)
    console.log(chalk.red(`${icon('error')} Unable to clone repo`))
    throw error
  }
}
