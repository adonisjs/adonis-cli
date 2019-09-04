/*
* @adonisjs/cli
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import { BaseCommand, flags } from '@adonisjs/ace'

import { Compiler } from '../Services/Compiler'
import { getRcContents } from '../Services/helpers'

/**
 * Command to compile and start HTTP server for AdonisJs
 * applications.
 */
export default class Serve extends BaseCommand {
  public static commandName = 'serve'
  public static description = 'Start HTTP server for development'

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
    const rcContents = await getRcContents(this.projectRoot)
    if (!rcContents) {
      this.$error('Make sure your project root has .adonisrc.json file to continue')
      return
    }

    const compiler = new Compiler(this, this.projectRoot, rcContents)

    /**
     * Watch or compile project
     */
    try {
      if (this.dev) {
        await compiler.watch()
      } else {
        await compiler.build(true)
      }
    } catch (error) {
      this.$error(error.message)
      console.error(error.stack)
    }
  }
}
