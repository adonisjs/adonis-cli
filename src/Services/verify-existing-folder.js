'use strict'

/**
 * adonis-cli
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const path = require('path')
const readDir = require('util').promisify(require('fs').readdir)

/**
 * Verifies that the installation folder is empty
 * or should not exists. Otherwise throws an
 * exception
 *
 * @method
 *
 * @param  {String} appPath
 * @param  {Object} stepsCounter
 *
 * @return {void}
 */
module.exports = async function (appPath, stepsCounter) {
  const name = path.basename(appPath)

  const step = stepsCounter.advance('Ensuring project directory is clean', 'flashlight', name)
  step.start()

  try {
    const files = await readDir(appPath)
    if (files.length > 0) {
      step.error('Directory is not empty', 'x')
      throw new Error(`Cannot override contents of [${name}]. Make sure to delete it or specify a new path`)
    }
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error
    }
  }

  step.success()
}
