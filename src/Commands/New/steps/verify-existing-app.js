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
const fs = require('fs')
const pify = require('pify')

/**
 * Verifies that the installation folder is empty
 * or should not exists. Otherwise throws an
 * exception
 *
 * @method
 *
 * @param  {String} appPath
 * @param  {Object} chalk
 * @param  {Function} icon
 *
 * @return {void}
 */
module.exports = async function (appPath, chalk, icon) {
  const name = path.basename(appPath)
  try {
    const files = await pify(fs.readdir)(appPath)
    if (files.length > 0) {
      console.log(chalk.red(`${icon('error')} The directory "${name}" is not empty!`))
      throw new Error(`Cannot override contents of ${name}.\nMake sure to delete it or specify a new path`)
    }
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error
    }
  }
}
