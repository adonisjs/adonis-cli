/*
* @adonisjs/cli
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import { BaseCommand, flags, args } from '@adonisjs/ace'

/**
 * Build the AdonisJs typescript project for production.
 */
export default class NewApp extends BaseCommand {
  public static commandName = 'new'
  public static description = 'Scaffold a new application'

  @flags.boolean({ description: 'Use yarn instead of npm for installing dependencies' })
  public yarn: boolean

  @args.string({ description: 'The name/path of the project directory', name: 'name' })
  public name: string

  /**
   * Reference to the project root. It always has to be
   * the current working directory
   */
  public projectRoot = process.cwd()

  /**
   * Dumps ascii logo to the terminal
   */
  public async dumpAsciiLogo () {
    const gradient = await import('gradient-string')

    // tslint:disable-next-line: max-line-length quotemark
    console.log(gradient.rainbow("    _       _             _         _     \n   / \\   __| | ___  _ __ (_)___    | |___ \n  / _ \\ / _` |/ _ \\| '_ \\| / __|_  | / __|\n / ___ \\ (_| | (_) | | | | \\__ \\ |_| \\__ \\\n/_/   \\_\\__,_|\\___/|_| |_|_|___/\\___/|___/\n"))
  }

  /**
   * Called by ace automatically, when this command is invoked
   */
  public async handle () {
    const { satisfiesNodeVersion } = await import('../Services/satisfiesNodeVersion')
    const { Installer } = await import('../Services/Installer')

    if (!satisfiesNodeVersion()) {
      const message = [
        `Unsatisfied Node.js version ${process.version}`,
        'Please update Node.js to {10.15.3} before you continue',
      ]
      this.$error(message.join(' '))
      return
    }

    await this.dumpAsciiLogo()
    const installer = new Installer(this.projectRoot, this.yarn ? 'yarn' : 'npm', false)
    installer.createApp(this.name)
  }
}
