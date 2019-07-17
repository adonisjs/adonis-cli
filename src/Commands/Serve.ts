/*
* @adonisjs/cli
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import { join } from 'path'
import { BaseCommand, flags } from '@adonisjs/ace'

/**
 * Command to compile and start HTTP server for AdonisJs
 * applications.
 */
export default class Serve extends BaseCommand {
  public static commandName = 'serve'
  public static description = 'Start HTTP server for development'

  /**
   * Start development server with file watcher
   */
  @flags.boolean({ description: 'Watch for file changes' })
  public dev: boolean

  /**
   * Reference to the project root. It always have to be
   * the current working directory
   */
  public projectRoot = process.cwd()

  /**
   * Called by ace automatically, when this command is invoked
   */
  public async handle () {
    const { Compiler } = await import('../Services/Compiler')
    const { rcParser } = await import('@poppinss/application')
    const { exists } = await import('fs-extra')

    const hasRcFile = await exists(join(this.projectRoot, '.adonisrc.json'))

    /**
     * Ensure `.adonisrc.json` file exists
     */
    if (!hasRcFile) {
      this.$error('Make sure your project root has .adonisrc.json file')
      return
    }

    const rcContents = rcParser.parse(require(join(this.projectRoot, '.adonisrc.json')))
    const compiler = new Compiler(this, this.projectRoot, rcContents)

    /**
     * Watch or compile project
     */
    try {
      if (this.dev) {
        await compiler.watch()
      } else {
        await compiler.build()
      }
    } catch (error) {
      this.$error(error.message)
      console.error(error.stack)
    }
  }
}
