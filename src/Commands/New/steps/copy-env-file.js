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
const chalk = require('chalk')

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
module.exports = async function (appPath, copy, stepsCounter) {
  const step = stepsCounter.advance('Copying default environment variables', 'open_book', '.env')
  step.start()

  try {
    await copy(path.join(appPath, '.env.example'), path.join(appPath, '.env'))
    step.success('Environment variables copied', 'white_check_mark')
  } catch (error) {
    step.error('Unable to copy environment variables', 'x')
    error.hint = `You can continue manually by copying ${chalk.magenta('.env.example')} to ${chalk.magenta('.env')}`
    throw error
  }
}
