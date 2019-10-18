/*
* @adonisjs/cli
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import { join } from 'path'
import { BaseCommand, args } from '@adonisjs/ace'
import { getRcContents } from '../../helpers'

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
      this.logger.error('Make sure your project root has .adonisrc.json file to continue')
      return
    }

    this.generator
      .addFile(this.name, { suffix: 'Provider', form: 'singular', pattern: 'pascalcase' })
      .stub(join(__dirname, '..', '..', '..', 'templates', 'provider.txt'))
      .destinationDir(rcContents.directories.providers || 'providers')
      .appRoot(this.projectRoot)
      .apply({})

    await this.generator.run()
  }
}
