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
 * This module copies the `.env.example` file to `.env`.
 *
 * @method
 *
 * @param  {String} appPath
 * @param  {Function} copy
 * @param  {Object} chalk
 * @param  {String} icon
 *
 * @return {void}
 */
module.exports = async function (appPath, copy, chalk, icon) {
  try {
    await copy(path.join(appPath, '.env.example'), path.join(appPath, '.env'))
    console.log(chalk.green(`${icon('success')} Default environment variables copied`))
  } catch (error) {
    console.log(chalk.red(`${icon('error')} Sorry we failed at copying environment variable`))
    throw error
  }
}
