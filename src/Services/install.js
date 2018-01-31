'use strict'

/**
 * adonis-cli
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

/**
 * Install dependencies from npm or yarn. The installation
 * tool must be installed on user machine
 *
 * @method
 *
 * @param  {String} via
 * @param  {Object} stepsCounter
 * @param  {String} [packageName = '']
 *
 * @return {void}
 */
module.exports = async function (via, stepsCounter, packageName) {
  const command = via === 'npm'
    ? (packageName ? `npm i --save ${packageName}` : 'npm install')
    : (packageName ? `yarn add ${packageName}` : 'yarn')

  const message = packageName ? `${via}: Installing` : `${via}: Installing project dependencies`
  const step = stepsCounter.advance(message, 'package', packageName)

  step.start()

  try {
    await require('./exec')(command)
    step.success('Dependencies installed')
  } catch (error) {
    step.error('Installation failed', 'x')
    error.hint = `You can manually install dependencies by running ${command}`
    throw error
  }
}
