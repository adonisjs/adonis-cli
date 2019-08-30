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
    const { exists } = await import('fs-extra')
    const { rcParser } = await import('@poppinss/application')
    const { Compiler } = await import('../Services/Compiler')

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
     * Pushing `package.json` and lock file to `copyToBuild` array, so that later we can run `npm install`
     * inside the build directory
     */
    rcContents.copyToBuild.push('package.json')
    if (this.yarn) {
      rcContents.copyToBuild.push('yarn.lock')
    } else {
      rcContents.copyToBuild.push('package-lock.json')
    }
    await compiler.buildForProduction(this.yarn ? 'yarn' : 'npm')
  }
}
