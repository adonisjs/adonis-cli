/*
* @adonisjs/cli
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import { join } from 'path'
import { BaseCommand, flags } from '@adonisjs/ace'
import { RcFile } from '@ioc:Adonis/Core/Application'

import { Compiler } from '../Services/Compiler'
import { HttpServer } from '../Services/HttpServer'
import { BuildWatcher } from '../Services/BuildWatcher'
import { getRcContents, SEVER_ENTRY_FILE, OUTDIR } from '../helpers'

/**
 * Command to compile and start HTTP server for AdonisJs
 * applications.
 */
export default class Serve extends BaseCommand {
  public static commandName = 'serve'
  public static description = 'Compile Typescript project to Javascript and start the development HTTP server'

  @flags.boolean({ description: 'Build the project and watch for file changes' })
  public watch: boolean

  @flags.array({ description: 'Pass arguments to the node command' })
  public nodeArgs: string[]

  @flags.boolean({
    description: 'Enable/disable the Typescript compiler, but still start the HTTP server',
    default: true,
  })
  public compile: boolean

  /**
   * Reference to the project root. It always have to be
   * the current working directory
   */
  public projectRoot = process.cwd()

  /**
   * Compile and serve the project
   */
  private async _compileAndServe (rcContents: RcFile) {
    const compiler = new Compiler(this.projectRoot, rcContents, this.nodeArgs)
    if (this.watch) {
      await compiler.watch()
    } else {
      await compiler.build(true)
    }
  }

  /**
   * Start the build watcher when compiler is set to false. Instead of parsing
   * the tsconfig.json file using the compiler, we manually attempt to read
   * the `outDir` property from it. Ideally this should be ok, unless we
   * get into some sort of complex behavior and then we will have to
   * change this piece of code as well.
   */
  private _serve (rcContents: RcFile) {
    const tsConfig = require(join(this.projectRoot, 'tsconfig.json'))
    const buildDir = (tsConfig && tsConfig.compilerOptions && tsConfig.compilerOptions.outDir) || OUTDIR

    if (this.watch) {
      new BuildWatcher(this.projectRoot, rcContents, this.nodeArgs).watch(buildDir)
    } else {
      new HttpServer(SEVER_ENTRY_FILE, buildDir, this.nodeArgs).start()
    }
  }

  /**
   * Called by ace automatically, when this command is invoked
   */
  public async handle () {
    const rcContents = await getRcContents(this.projectRoot)
    if (!rcContents) {
      this.$error('Make sure your project root has .adonisrc.json file to continue')
      return
    }

    if (this.compile === false) {
      this._serve(rcContents)
    } else {
      await this._compileAndServe(rcContents)
    }
  }
}
