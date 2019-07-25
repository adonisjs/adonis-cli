/*
 * @adonisjs/cli
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import * as del from 'del'
import { join, relative } from 'path'
import * as nanomatch from 'nanomatch'
import * as tsStatic from 'typescript'
import * as copyfiles from 'copyfiles'
import { BaseCommand } from '@adonisjs/ace'
import { ensureDir, remove } from 'fs-extra'
import { TypescriptCompiler } from '@poppinss/chokidar-ts'
import { RcFile } from '@poppinss/application/build/src/contracts'

import { HttpServer } from './HttpServer'
import { iocTransformer } from '../Transformers/ioc'
import { logInfo, logPairs, logTsCompilerError } from './logger'

/**
 * Exposes the API to compile and watch AdonisJs projects.
 */
export class Compiler {
  /**
   * Reference to typescript compiler to compiling the code
   */
  private _compiler: TypescriptCompiler

  /**
   * Reference to typescript used by the underlying compiler
   */
  private _ts: typeof tsStatic

  /**
   * Following dot files are not ignored by the watcher and we also restart
   * the HTTP server on their change
   */
  private _specialDotFiles = ['.adonisrc.json', '.env']

  constructor (
    private _command: BaseCommand,
    private _projectRoot: string,
    private _rcFile: RcFile,
  ) {
    const compilerPath = require.resolve('typescript/lib/typescript', { paths: [this._projectRoot] })

    /**
     * Create typescript compiler instance
     */
    this._compiler = new TypescriptCompiler(require(compilerPath), 'tsconfig.json', this._projectRoot)
    this._compiler.use((ts) => {
      return iocTransformer(ts, this._rcFile)
    }, 'after')

    /**
     * Hold reference to the underlying typescript instance
     */
    this._ts = this._compiler['_ts']
  }

  /**
   * Clear the stdout stream
   */
  private _clearScreen () {
    process.stdout.write('\x1B[2J\x1B[3J\x1B[H\x1Bc')
  }

  /**
   * Copy files from the project root to the build directory. Relative
   * paths inside the files array will be resolved from the
   * project root.
   */
  public async _copyFiles (files: string[], dest: string) {
    return new Promise((resolve, reject) => {
      logPairs(this._command, [
        ['copy', ` ${files.join(',')} `],
        ['to', ` ${this._getRelativePath(dest)}`],
      ])

      copyfiles(files.concat(dest), {}, (error: Error) => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }

  /**
   * Cleans up the build directory by removing and re-creating it
   */
  private async _cleanupBuildDir (outDir: string) {
    logInfo(this._command, 'cleanup build', this._getRelativePath(outDir))

    /**
     * Make sure to delete old build. This will ensure that intermediate
     * files are also removed
     */
    await del(outDir)

    /**
     * Ensure that root dir exists
     */
    await ensureDir(outDir)
  }

  /**
   * Returns relative file to the path from the project root
   */
  private _getRelativePath (filePath: string): string {
    return relative(this._projectRoot, filePath)
  }

  /**
   * Formats the diagnostic message to string
   */
  private _formatDiagnostic (diagnostic: tsStatic.Diagnostic): string {
    const formattedText = this._ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
    let message = ''

    if (diagnostic.file) {
      const relativePath = this._getRelativePath(this._projectRoot)
      const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!)
      message += this._command.colors.dim(`> ${relativePath}(${line + 1}:${character + 1}) `)
    } else {
      message += this._command.colors.dim('> ')
    }

    message += this._command.colors.dim(`[TS${diagnostic.code}]: `)
    message += this._command.colors.red(formattedText)
    return message
  }

  /**
   * Parses the `tsconfig.json` file and handles error by printing
   * them to the console.
   */
  private _parseConfig (): tsStatic.ParsedCommandLine | undefined {
    const { error, config } = this._compiler.parseConfig({ declaration: false })

    /**
     * Print the config error (if any)
     */
    if (error) {
      const header = this._command.colors.red('Typescript config parse error')
      const body = this._formatDiagnostic(error)
      logTsCompilerError(header, body)
      return
    }

    /**
     * Print config parsing errors (if any)
     */
    if (config!.errors.length) {
      const header = this._command.colors.red('Typescript config parse error')
      const body = config!.errors.map((error) => this._formatDiagnostic(error))
      logTsCompilerError(header, body.join('\n'))
      return
    }

    /**
     * Force user to define `rootDir` for reliable output structure.
     */
    if (!config!.options.rootDir) {
      this._command.$error('Make sure to define {rootDir} in tsconfig.json file')
      return
    }

    /**
     * Set the outDir as build when not defined inside the
     * config file.
     */
    config!.options.outDir = config!.options.outDir || 'build'
    return config!
  }

  /**
   * Process the build diagnostics by printing them to the console
   */
  private _processBuildDiagnostics (hasError: boolean, diagnostics: tsStatic.Diagnostic[]) {
    if (!diagnostics.length) {
      return
    }

    const header = this._command.colors.red(`Typescript compiler error ${hasError ? '(emitSkipped)' : ''}`)
    const body = diagnostics.map((diagnostic) => this._formatDiagnostic(diagnostic))
    logTsCompilerError(header, body.join('\n'))
  }

  /**
   * Handles static file changes by performing following tasks
   *
   * 1. If file path is part of `copyToBuild`, then it will copy it to the
   *    build directory.
   * 2. If file path is a specialDotFile, then it will copy the file to build
   *    directory + restart the server.
   */
  private async _handleFileChange (filePath: string, outDir: string, httpServer: HttpServer) {
    if (this._specialDotFiles.includes(filePath)) {
      await this._copyFiles([filePath], outDir)
      httpServer.restart()
      return
    }

    /**
     * Copy static files without re-starting the server
     */
    if (nanomatch.isMatch(filePath, this._rcFile.copyToBuild)) {
      await this._copyFiles([filePath], outDir)
    }
  }

  /**
   * Builds the typescript project
   */
  public async build (startServer: boolean = false) {
    const config = this._parseConfig()
    if (!config) {
      return
    }

    /**
     * Step 1: Cleanup build directory
     */
    await this._cleanupBuildDir(config.options.outDir!)

    /**
     * Step 2: Copy files defined inside `rcFile.copyToBuild`
     */
    await this._copyFiles(this._rcFile.copyToBuild, config.options.outDir!)

    /**
     * Step 3: Build project using Typescript compiler
     */
    this._compiler.on('initial:build', this._processBuildDiagnostics.bind(this))
    this._compiler.build(config)

    /**
     * Step 4: Optionally, start the HTTP server when `startServer` is set to true
     */
    if (startServer) {
      console.log(this._command.colors.bgGreen().black(' Starting server '))
      new HttpServer(`${config.options.outDir}/server.js`, this._projectRoot).start()
    }
  }

  /**
   * Build the project and start watcher for incremental builds
   */
  public async watch () {
    const config = this._parseConfig()
    if (!config) {
      return
    }

    /**
     * Reference to HTTP server
     */
    const httpServer = new HttpServer(`${config.options.outDir}/server.js`, this._projectRoot)

    /**
     * Step 1: Cleanup build directory
     */
    await this._cleanupBuildDir(config.options.outDir!)

    /**
     * Step 2: Copy files defined inside `rcFile.copyToBuild`
     */
    await this._copyFiles(this._rcFile.copyToBuild, config.options.outDir!)

    /**
     * Handle initial:build event to print diagnostics
     */
    this._compiler.on('initial:build', (hasError, diagnostics) => {
      this._processBuildDiagnostics(hasError, diagnostics)

      if (!hasError && diagnostics.length === 0) {
        console.log(this._command.colors.bgGreen().black(' Starting server '))
        httpServer.start()
      }
    })

    /**
     * Handle subsequent:build event to print diagnostics and restart
     * the HTTP server.
     */
    this._compiler.on('subsequent:build', (filePath, hasError, diagnostics) => {
      this._clearScreen()
      this._processBuildDiagnostics(hasError, diagnostics)

      if (!hasError && diagnostics.length === 0) {
        logInfo(this._command, 'compiled', filePath)
        httpServer.restart()
      }
    })

    /**
     * Handle new files
     */
    this._compiler.on('add', (filePath) => {
      this._handleFileChange(filePath, config.options.outDir!, httpServer)
    })

    /**
     * Handle changes to existing files
     */
    this._compiler.on('change', (filePath) => {
      this._handleFileChange(filePath, config.options.outDir!, httpServer)
    })

    /**
     * Handle file deletion
     */
    this._compiler.on('unlink', async (filePath) => {
      if (nanomatch.isMatch(filePath, this._rcFile.copyToBuild)) {
        logInfo(this._command, 'removing', filePath)
        await remove(join(config.options.outDir!, filePath))
      }
    })

    /**
     * Remove the output file when source file is removed
     */
    this._compiler.on('source:unlink', async (filePath) => {
      const outputPath = relative(config.options.rootDir!, filePath).replace(/\.(d)?ts$/, '.js')
      logInfo(this._command, 'removing', outputPath)
      await remove(join(config.options.outDir!, outputPath))
      httpServer.restart()
    })

    /**
     * Start watcher
     */
    this._compiler.watch(config, ['.'], {
      ignored: [
        'node_modules/**',
        `${config.options.outDir}/**`,
        (filePath: string) => {
          if (/(^|[\/\\])\../.test(filePath)) {
            return !this._specialDotFiles.find((file) => filePath.endsWith(file))
          }
          return false
        },
      ],
    })
  }
}
