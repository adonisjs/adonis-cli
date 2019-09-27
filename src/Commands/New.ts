/*
* @adonisjs/cli
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import { BaseCommand, flags, args } from '@adonisjs/ace'

import { Installer } from '../Services/Installer'
import { dumpAsciiLogo } from '../Services/logger'
import { satisfiesNodeVersion } from '../Services/helpers'

/**
 * Build the AdonisJs typescript project for production.
 */
export default class NewApp extends BaseCommand {
  public static commandName = 'new'
  public static description = 'Scaffold a new application'

  @flags.boolean({ description: 'Use yarn instead of npm for installing dependencies' })
  public yarn: boolean

  @args.string({ description: 'The name/path of the project directory' })
  public name: string

  @flags.boolean({ description: 'Create project for REST API server' })
  public apiOnly: boolean

  /**
   * Reference to the project root. It always has to be
   * the current working directory
   */
  public projectRoot = process.cwd()

  /**
   * Called by ace automatically, when this command is invoked
   */
  public async handle () {
    if (!satisfiesNodeVersion()) {
      const message = [
        `Unsatisfied Node.js version ${process.version}`,
        'Please update Node.js to {10.15.3} before you continue',
      ]
      this.$error(message.join(' '))
      return
    }

    dumpAsciiLogo()
    const installer = new Installer(this.projectRoot, this.yarn ? 'yarn' : 'npm', false)
    const flags = this.apiOnly ? ['--boilerplate', 'api'] : ['--boilerplate', 'web']

    installer.createApp(this.name, flags)
  }
}
