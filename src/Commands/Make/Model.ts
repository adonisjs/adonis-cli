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
 * Make a new model
 */
export default class MakeModel extends BaseCommand {
  public static commandName = 'make:model'
  public static description = 'Make a new Lucid model'

  @args.string({ description: 'Name of the model' })
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

    let modelsPath = 'app/Models'

    /**
     * Finding the models path from the `models` namespace. We need
     * to find the base namespace and then find the corresponding
     * path for that namespace
     */
    Object.keys(rcContents.autoloads).forEach((namespace) => {
      const models = rcContents.namespaces.models
      if (models && models.startsWith(`${namespace}/`)) {
        const namespacePath = rcContents.autoloads[namespace]
        modelsPath = models.replace(namespace, namespacePath)
      }
    })

    await new ResourceBuilder(this.projectRoot, this.name)
      .destinationPath(modelsPath)
      .useTemplate('model.txt', {})
      .make()
  }
}
