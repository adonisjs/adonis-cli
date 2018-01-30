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
const fs = require('fs-extra')
const debug = require('debug')('adonis:cli')

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
module.exports = async function (ctx, modulePath) {
  const instructionsFilePath = path.join(modulePath, 'instructions.js')

  const hasInstructionsFile = await fs.pathExists(instructionsFilePath)
  if (!hasInstructionsFile) {
    return
  }

  try {
    debug('found instructions.js file for %s', modulePath)
    const instructions = require(instructionsFilePath)
    if (typeof (instructions) === 'function') {
      await instructions(ctx)
    }
  } catch (error) {
    error.message = `instructions.js: ${error.message}`
    throw error
  }
}
