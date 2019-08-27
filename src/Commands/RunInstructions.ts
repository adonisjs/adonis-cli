/*
* @adonisjs/cli
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import { BaseCommand, args } from '@adonisjs/ace'

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
    const { executeInstructions, sinkVersion } = await import('@adonisjs/sink')
    const { Application } = await import('@poppinss/application')

    /**
     * Watch or compile project
     */
    try {
      const app = new Application(this.projectRoot, {} as any, {}, {})
      await executeInstructions(this.projectName, this.projectRoot, app)
    } catch (error) {
      this.$error(this.colors.red(`Unable to execute instructions for ${this.projectName} package`) as string)
      this.$info(`Sink version: ${sinkVersion}`)
      console.log('')
      console.log(this.colors.bgRed(' Error stack  '))

      console.log(error.stack.split('\n').map((line) => {
        return `  ${this.colors.red(line)}`
      }).join('\n'))
    }
  }
}
