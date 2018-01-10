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
module.exports = async function (via, packageName, stepsCounter) {
  const command = via === 'npm' ? `npm install --save ${packageName}` : `yarn add ${packageName}`

  const step = stepsCounter.advance('Installing', 'package', packageName)
  step.start()

  try {
    await pify(exec)(command)
    step.success('Installed', 'white_check_mark')
    console.log('')
  } catch (error) {
    step.success('Installation failed', 'x')
    throw error
  }
}
