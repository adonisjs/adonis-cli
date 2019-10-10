/*
* @adonisjs/cli
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import { BaseCommand, flags } from '@adonisjs/ace'

import { getRcContents } from '../helpers'
import { Compiler } from '../Services/Compiler'

/**
 * Build the AdonisJs typescript project for production.
 */
export default class Build extends BaseCommand {
  public static commandName = 'build'
  public static description = `Compile Typescript project to Javascript`

  @flags.boolean({
    description: 'Use yarn instead of npm for installing dependencies',
  })
  public yarn: boolean

  @flags.boolean({ description: 'Build the project for development and watch for file changes' })
  public watch: boolean

  /**
   * Reference to the project root. It always has to be
   * the current working directory
   */
  public projectRoot = process.cwd()

  /**
   * Called by ace automatically, when this command is invoked
   */
  public async handle () {
    const rcContents = await getRcContents(this.projectRoot)

    /**
     * Ensure `.adonisrc.json` file exists
     */
    if (!rcContents) {
      this.$error('Make sure your project root has .adonisrc.json file to continue')
      return
    }

    const compiler = new Compiler(this.projectRoot, rcContents, [])

    if (this.watch) {
      await compiler.watch(false)
    } else {
      await compiler.buildForProduction(this.yarn ? 'yarn' : 'npm')
    }
  }
}
