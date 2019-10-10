/*
 * @adonisjs/cli
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { yellow } from 'kleur'
import fancyLogs from '@poppinss/fancy-logs'
import { InvalidFlagType } from '@adonisjs/ace/build/src/Exceptions/InvalidFlagType'
import { MissingCommandArgument } from '@adonisjs/ace/build/src/Exceptions/MissingCommandArgument'

/**
 * Handles the exceptions raised while running a command
 */
export async function handleException (error: any) {
  /**
   * Missing command argument
   */
  if (error instanceof MissingCommandArgument) {
    const { command, argumentName } = error
    fancyLogs.error(`Missing argument ${argumentName}`)
    console.log(`            Consult the command help by typing ${yellow(`adonis ${command.commandName} --help`)}`)
    return
  }

  /**
   * Flag value has invalid type
   */
  if (error instanceof InvalidFlagType) {
    const { command, argumentName, exceptedType } = error
    const message = `${argumentName} is must be a valid ${exceptedType}`
    fancyLogs.error(message)

    if (command) {
      console.log(`            Consult the command help by typing ${yellow(`adonis ${command.commandName} --help`)}`)
    }
    return
  }

  fancyLogs.fatal(error)
}
