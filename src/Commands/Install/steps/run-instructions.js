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

/**
 * Executes the instructions file only if it
 * exists
 *
 * @method
 * @async
 *
 * @param  {Object} ctx
 * @param  {String} modulePath
 *
 * @return {void}
 */
module.exports = async function (ctx, modulePath, pathExists) {
  const instructionsFilePath = path.join(modulePath, 'instructions.js')
  const hasInstructionsFile = await pathExists(instructionsFilePath)
  if (!hasInstructionsFile) {
    return
  }

  try {
    const instructions = require(instructionsFilePath)
    if (typeof (instructions) === 'function') {
      await instructions(ctx)
    }
  } catch (error) {
    error.message = `instructions.js: ${error.message}`
    throw error
  }
}
