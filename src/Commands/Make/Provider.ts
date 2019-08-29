/*
* @adonisjs/cli
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import { join } from 'path'
import { exists } from 'fs-extra'
import { BaseCommand, args } from '@adonisjs/ace'
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
    const hasRcFile = await exists(join(this.projectRoot, '.adonisrc.json'))

    /**
     * Ensure `.adonisrc.json` file exists
     */
    if (!hasRcFile) {
      this.$error('Make sure your project root has .adonisrc.json file')
      return
    }

    await new ResourceBuilder(this, 'Provider')
      .destinationPath('providers')
      .useTemplate('provider.txt', {})
      .make()
  }
}
