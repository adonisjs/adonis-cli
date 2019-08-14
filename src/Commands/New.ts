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

  @args.string({ description: 'The name of the project you want to create', name: 'name' })
  public name: string

  /**
   * Reference to the project root. It always has to be
   * the current working directory
   */
  public projectRoot = process.cwd()

  /**
   * Called by ace automatically, when this command is invoked
   */
  public async handle () {
    const { satisfiesNodeVersion } = await import('../Services/satisfiesNodeVersion')
    const { Installer } = await import('../Services/Installer')
    const Listr = await import('listr')
    const UpdaterRenderer = await import('listr-update-renderer')

    if (!satisfiesNodeVersion()) {
      const message = [
        `Unsatisfied Node.js version ${process.version}`,
        'Please update Node.js to {10.15.3} before you continue',
      ]
      this.$error(message.join(' '))
      return
    }

    const installer = new Installer(this.projectRoot, this.yarn ? 'yarn' : 'npm', false)
    const self = this

    const tasks = new Listr([
      {
        title: 'installing dependencies',
        task () {
          return installer.createApp(self.name)
        },
      },
    ], {
      renderer: UpdaterRenderer,
      collapse: false,
    })

    try {
      await tasks.run()
    } catch (error) {
      console.log(error)
    }
  }
}
