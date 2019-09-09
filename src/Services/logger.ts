/*
* @adonisjs/cli
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import boxen from 'boxen'
import { green } from 'kleur'
import { BaseCommand } from '@adonisjs/ace'

/**
 * Logs info with help text
 */
export function logInfo (command: BaseCommand, message: string, helpText?: string) {
  command.$info(`${message} ${helpText ? command.colors.dim().yellow(helpText) : ''}`)
}

/**
 * Logs the ts compile error inside a box, so that it's easy
 * to discover visually.
 */
export function logTsCompilerError (title: string, body: string) {
  console.error(boxen(`${title}\n${body}`, {
    padding: {
      top: 0,
      bottom: 0,
      left: 1,
      right: 1,
    },
    borderColor: 'red',
  }))
}

/**
 * Logs pair text
 */
export function logPairs (command: BaseCommand, textPairs: string[][]) {
  let message = ''

  textPairs.forEach((pair) => {
    message += `${pair[0]}${command.colors.dim().yellow(pair[1])}`
  })

  command.$info(message)
}

/**
 * Dumps ascii logo to the console
 */
export function dumpAsciiLogo () {
  // tslint:disable-next-line: max-line-length quotemark
  console.log(require('gradient-string').rainbow("    _       _             _         _     \n   / \\   __| | ___  _ __ (_)___    | |___ \n  / _ \\ / _` |/ _ \\| '_ \\| / __|_  | / __|\n / ___ \\ (_| | (_) | | | | \\__ \\ |_| \\__ \\\n/_/   \\_\\__,_|\\___/|_| |_|_|___/\\___/|___/\n"))
}

/**
 * Logs a message with `create` as label
 */
export function logCreateAction (message: string) {
  console.log(` ${green('create')}     ${message}`)
}
