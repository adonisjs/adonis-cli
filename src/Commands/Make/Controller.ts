/*
* @adonisjs/cli
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import { join } from 'path'
import { BaseCommand, args, flags } from '@adonisjs/ace'
import { getRcContents, getPathForNamespace } from '../../helpers'

/**
 * Make a new controller
 */
export default class MakeController extends BaseCommand {
  public static commandName = 'make:controller'
  public static description = 'Make a new HTTP controller'

  @args.string({ description: 'Name of the controller' })
  public name: string

  @flags.boolean({ description: 'Create a resourceful controller' })
  public resource: boolean

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
    const controllerPath = getPathForNamespace(rcContents.autoloads, rcContents.namespaces.httpControllers)

    this.generator
      .addFile(this.name, { suffix: 'Controller', form: 'singular', pattern: 'pascalcase' })
      .stub(join(templatesDir, this.resource ? 'resource-controller.txt' : 'controller.txt'))
      .destinationDir(controllerPath || 'app/Controllers/Http')
      .appRoot(this.projectRoot)
      .apply({})

    await this.generator.run()
  }
}
