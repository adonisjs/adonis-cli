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
const chalk = require('chalk')

/**
 * Install dependencies from npm or yarn. The installation
 * tool must be installed on user machine
 *
 * @method
 *
 * @param  {String} appPath
 * @param  {String} via
 * @param  {Object} stepsCounter
 *
 * @return {void}
 */
module.exports = async function (appPath, via, stepsCounter) {
  const command = via === 'npm' ? 'npm install' : 'yarn'

  const step = stepsCounter.advance('Installing project dependencies', 'package', command)
  step.start()

  try {
    await pify(exec)(command)
    step.success('Dependencies installed', 'white_check_mark')
  } catch (error) {
    step.error('Installation failed', 'x')
    error.hint = `You can manually install dependencies by running ${chalk.magenta(command)}`
    throw error
  }
}
