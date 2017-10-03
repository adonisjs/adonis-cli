'use strict'

/*
 * adonis-cli
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const boxen = require('boxen')

/**
 * Prints a message to tell the user on what next
 * to do after creating a new project
 *
 * @method exports
 *
 * @param  {String} appName
 * @param  {Object} chalk
 *
 * @return {void}
 */
module.exports = function (appName, chalk) {
  const message = `${chalk.dim('✨ Application crafted')}

cd ${chalk.cyan(appName)}
${chalk.cyan('adonis serve --dev')}`

  console.log(boxen(message, {
    dimBorder: true,
    align: 'left',
    padding: {
      left: 8,
      right: 8
    },
    borderColor: 'yellow'
  }))
}
