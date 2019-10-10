/*
* @adonisjs/cli
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import { BaseCommand } from '@adonisjs/ace'
import { Application } from '@adonisjs/application/build/standalone'

import { getRcContents } from '../helpers'

/**
 * Run instructions for a given dependency
 */
export default class RunInstructions extends BaseCommand {
  public static commandName = 'dump:rcfile'
  public static description = 'Shows the contents of rcfile with conventional defaults'

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

    const app = new Application(this.projectRoot, {} as any, rcContents, {})
    console.log(JSON.stringify(app.rcFile, null, 2))
  }
}
