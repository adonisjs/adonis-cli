/*
 * @adonisjs/cli
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { bgRed, red } from 'kleur'
import { InvalidFlagType } from '@adonisjs/ace/build/src/Exceptions/InvalidFlagType'
import { MissingCommandArgument } from '@adonisjs/ace/build/src/Exceptions/MissingCommandArgument'

/**
 * Handles the exceptions raised while running a command
 */
export function handleException (error: any) {
  console.log('')

  /**
   * Missing command argument
   */
  if (error instanceof MissingCommandArgument) {
    const { command, argumentName } = error
    const commandInstance = new command()
    const message = `${argumentName} is required to execute ${command.commandName} command`
    commandInstance.$error(message)
    return
  }

  /**
   * Flag value has invalid type
   */
  if (error instanceof InvalidFlagType) {
    const { command, argumentName, exceptedType } = error
    const commandInstance = new command!()
    const message = `${argumentName} is must be a valid ${exceptedType}`
    commandInstance.$error(message)
    return
  }

  console.log(bgRed('  Fatal error  '))
  console.log(red(error.stack))
}
