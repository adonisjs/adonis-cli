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
import { getRcContents, getPathForNamespace } from '../../helpers'

/**
 * Make a new controller
 */
export default class MakeMiddleware extends BaseCommand {
  public static commandName = 'make:middleware'
  public static description = 'Make a new HTTP middleware'

  @args.string({ description: 'Name of the middleware' })
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

    const templatesDir = join(__dirname, '..', '..', '..', 'templates')
    const middlewarePath = getPathForNamespace(rcContents.autoloads, rcContents.namespaces.middleware)

    this.generator
      .addFile(this.name, { form: 'singular', pattern: 'pascalcase' })
      .stub(join(templatesDir, 'middleware.txt'))
      .destinationDir(middlewarePath || 'app/Middleware')
      .appRoot(this.projectRoot)
      .apply({})

    await this.generator.run()
  }
}
