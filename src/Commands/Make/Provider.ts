/*
* @adonisjs/cli
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import { BaseCommand, args } from '@adonisjs/ace'

import { getRcContents } from '../../Services/helpers'
import { ResourceBuilder } from '../../Services/ResourceBuilder'

/**
 * Make a new controller
 */
export default class MakeProvider extends BaseCommand {
  public static commandName = 'make:provider'
  public static description = 'Make a new provider class'

  @args.string({ description: 'Name of the provider' })
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
    const rcContents = await getRcContents(this.projectRoot)

    /**
     * Ensure `.adonisrc.json` file exists
     */
    if (!rcContents) {
      this.$error('Make sure your project root has .adonisrc.json file to continue')
      return
    }

    await new ResourceBuilder(this, 'Provider')
      .destinationPath(rcContents.directories.providers)
      .useTemplate('provider.txt', {})
      .make()
  }
}
