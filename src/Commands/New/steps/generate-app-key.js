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
 * Generates the app key by executing key:generate
 * ace comamnd.
 *
 * @method
 *
 * @param  {Object} chalk
 * @param  {Function} icon
 *
 * @return {void}
 */
module.exports = async function (chalk, icon) {
  try {
    await pify(exec)('adonis key:generate')
    console.log(chalk.green(`${icon('success')} generated unique APP_KEY`))
  } catch (error) {
    console.log(chalk.red(`${icon('error')} Sorry we failed at setting up the APP_KEY`))
    throw error
  }
}
