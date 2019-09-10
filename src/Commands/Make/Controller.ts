/*
* @adonisjs/cli
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import { BaseCommand, args, flags } from '@adonisjs/ace'

import { getRcContents } from '../../Services/helpers'
import { ResourceBuilder } from '../../Services/ResourceBuilder'

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
      this.$error('Make sure your project root has .adonisrc.json file to continue')
      return
    }

    let controllerPath = 'app/Controllers/Http'

    /**
     * Finding the controller path from the `httpControllers` namespace. We need
     * to find the base namespace and then find the corresponding path for
     * that namespace
     */
    Object.keys(rcContents.autoloads).forEach((namespace) => {
      if (rcContents.namespaces.httpControllers.startsWith(`${namespace}/`)) {
        const namespacePath = rcContents.autoloads[namespace]
        controllerPath = rcContents.namespaces.httpControllers.replace(namespace, namespacePath)
      }
    })

    await new ResourceBuilder(this, 'Controller')
      .destinationPath(controllerPath)
      .useTemplate(this.resource ? 'resource-controller.txt' : 'controller.txt', {})
      .make()
  }
}
