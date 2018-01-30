'use strict'

/**
 * adonis-cli
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const exec = require('util').promisify(require('child_process').exec)

module.exports = async function (command) {
  const { stdout } = await exec(command)
  return stdout
}
