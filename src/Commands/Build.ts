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
 * Build the AdonisJs typescript project for production.
 */
export default class Build extends BaseCommand {
  public static commandName = 'build'
  public static description = 'Build typescript project for production'

  @flags.boolean({ description: 'Use yarn instead of npm for installing dependencies' })
  public yarn: boolean

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

    const compiler = new Compiler(this, this.projectRoot, rcContents, [])

    /**
     * Pushing `package.json` and lock file to `copyToBuild` array, so that later we can run `npm install`
     * inside the build directory
     */
    rcContents.metaFiles.push({ pattern: 'package.json', reloadServer: false })
    if (this.yarn) {
      rcContents.metaFiles.push({ pattern: 'package.json', reloadServer: false })
    } else {
      rcContents.metaFiles.push({ pattern: 'package-lock.json', reloadServer: false })
    }

    await compiler.buildForProduction(this.yarn ? 'yarn' : 'npm')
  }
}
