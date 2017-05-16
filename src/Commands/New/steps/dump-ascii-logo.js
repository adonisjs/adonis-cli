'use strict'

/*
 * adonis-cli
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

/**
 * Print the ascii logo to the console
 */
module.exports = function (chalk) {
  console.log(chalk.cyan.dim("    _       _             _         _     \n   / \\   __| | ___  _ __ (_)___    | |___ \n  / _ \\ / _` |/ _ \\| '_ \\| / __|_  | / __|\n / ___ \\ (_| | (_) | | | | \\__ \\ |_| \\__ \\\n/_/   \\_\\__,_|\\___/|_| |_|_|___/\\___/|___/\n"))
}
