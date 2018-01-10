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
const chalk = require('chalk')

/**
 * Generates the app key by executing key:generate
 * ace comamnd.
 *
 * @method
 *
 * @param  {Object} stepsCounter
 *
 * @return {void}
 */
module.exports = async function (stepsCounter) {
  const step = stepsCounter.advance('Generating APP_KEY', 'key', 'adonis key:generate')
  step.start()

  try {
    await pify(exec)('adonis key:generate')
    step.success('Key generated', 'white_check_mark')
  } catch (error) {
    step.error('Unable to generate key', 'x')
    error.hint = `You can continue manually by running ${chalk.magenta('adonis key:generate')}`
    throw error
  }
}
