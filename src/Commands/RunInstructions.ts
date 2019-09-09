/*
* @adonisjs/cli
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import { BaseCommand, args } from '@adonisjs/ace'
import { Application } from '@adonisjs/application/build/standalone'
import { executeInstructions, sinkVersion } from '@adonisjs/sink'

import { getRcContents } from '../Services/helpers'

/**
 * Run instructions for a given dependency
 */
export default class RunInstructions extends BaseCommand {
  public static commandName = 'run:instructions'
  public static description = 'Run instructions for a given adonisjs package.'

  @args.string({
    description: 'Name of the package. It must be installed as your project dependency',
    name: 'projectName',
  })
  public projectName: string

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

    try {
      const app = new Application(this.projectRoot, {} as any, rcContents, {})
      await executeInstructions(this.projectName, this.projectRoot, app)
    } catch (error) {
      this.$error(this.colors.red(`Unable to execute instructions for ${this.projectName} package`) as string)
      this.$info(`Sink version: ${sinkVersion}`)
      console.log('')
      console.log(this.colors.bgRed(' Error stack  '))

      console.log(error.stack.split('\n').map((line: string) => {
        return `  ${this.colors.red(line)}`
      }).join('\n'))
    }
  }
}
