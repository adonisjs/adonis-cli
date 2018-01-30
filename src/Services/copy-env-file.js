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

/**
 * This module copies the `.env.example` file to `.env`.
 *
 * @method
 *
 * @param  {String}   appPath
 * @param  {Function} copy
 * @param  {Object}   stepsCounter
 *
 * @return {void}
 */
module.exports = async function (appPath, stepsCounter) {
  const step = stepsCounter.advance('Copying default environment variables', 'open_book', '.env')
  step.start()

  try {
    await fs.copy(path.join(appPath, '.env.example'), path.join(appPath, '.env'))
    step.success('Environment variables copied')
  } catch (error) {
    step.error('Unable to copy environment variables', 'x')
    throw error
  }
}
