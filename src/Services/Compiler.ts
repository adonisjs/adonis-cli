/*
 * @adonisjs/cli
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import del from 'del'
import copyfiles from 'copyfiles'
import tsStatic from 'typescript'
import { join, relative } from 'path'
import { ensureDir, remove } from 'fs-extra'
import fancyLogs from '@poppinss/fancy-logs'
import { RcFile } from '@ioc:Adonis/Core/Application'
import { TypescriptCompiler } from '@poppinss/chokidar-ts'

import { Installer } from './Installer'
import { RcFileWrapper } from './RcFileWrapper'
import { iocTransformer } from '../Transformers/ioc'
import { HttpServer, DummyHttpServer } from './HttpServer'
import { clearScreen, reportTsDiagnostics } from './helpers'

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
  public ts: typeof tsStatic

  /**
   * Wrapper to work with `.adonisrc.json` file
   */
  private _rcWrapper = new RcFileWrapper(this.projectRoot, this._rcFile)

  constructor (
    public projectRoot: string,
    private _rcFile: RcFile,
    private _nodeArgs: string[],
  ) {
    this._setupCompiler()
  }

  /**
   * Instantiates the compiler
   */
  private _setupCompiler () {
    const compilerPath = require.resolve('typescript/lib/typescript', { paths: [this.projectRoot] })

    /**
     * Create typescript compiler instance
     */
    this._compiler = new TypescriptCompiler(require(compilerPath), 'tsconfig.json', this.projectRoot)
    this._compiler.use((ts) => iocTransformer(ts, this._rcFile), 'after')

    /**
     * Hold reference to the underlying typescript instance
     */
    this.ts = this._compiler.ts
  }

  /**
   * Copy files from the project root to the build directory. Relative
   * paths inside the files array will be resolved from the
   * project root.
   */
  private async _copyFiles (files: string[], dest: string) {
    return new Promise((resolve, reject) => {
      fancyLogs.info({
        message: `copy ${files.join(',')}`,
        suffix: `to ${relative(this.projectRoot, dest)}`,
      })

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
    fancyLogs.info({
      message: 'cleanup old build',
      suffix: relative(this.projectRoot, outDir),
    })

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
   * Parses the `tsconfig.json` file and handles error by printing
   * them to the console.
   */
  private _parseConfig (): tsStatic.ParsedCommandLine | undefined {
    const { error, config } = this._compiler.parseConfig({ declaration: false })

    /**
     * Print the config error (if any)
     */
    if (error) {
      fancyLogs.error('Typescript config parse error')
      reportTsDiagnostics([error], this.ts, this._compiler.host)
      return
    }

    /**
     * Print config parsing errors (if any)
     */
    if (config!.errors.length) {
      fancyLogs.error('Typescript config parse error')
      reportTsDiagnostics(config!.errors, this.ts, this._compiler.host, config!.options['pretty'] as boolean)
      return
    }

    /**
     * Force user to define `rootDir` for reliable output structure.
     */
    if (!config!.options.rootDir) {
      fancyLogs.error('Make sure to define {rootDir} in tsconfig.json file')
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
  private _processBuildDiagnostics (
    diagnostics: tsStatic.Diagnostic[],
    options: tsStatic.CompilerOptions,
  ) {
    if (!diagnostics.length) {
      return
    }

    reportTsDiagnostics(diagnostics, this.ts, this._compiler.host, options['pretty'] as boolean)
  }

  /**
   * Handles static file changes
   */
  private async _handleFileChange (filePath: string, outDir: string, httpServer: HttpServer) {
    /**
     * Since the `copyFiles` method logs the message to the console
     * we do not log anything inside this method
     */
    if (this._rcWrapper.isReloadServerFile(filePath)) {
      await this._copyFiles([filePath], outDir)
      httpServer.restart()
      return
    }

    /**
     * Copy static files without re-starting the server
     */
    if (this._rcWrapper.isMetaFile(filePath)) {
      await this._copyFiles([filePath], outDir)
    }
  }

  /**
   * Handling static file removals
   */
  private async _handleFileRemoval (filePath: string, outDir: string, httpServer: HttpServer) {
    fancyLogs.delete(filePath)

    if (this._rcWrapper.isReloadServerFile(filePath)) {
      await remove(join(outDir!, filePath))
      httpServer.restart()
      return
    }

    /**
     * Remove file without re-starting the server
     */
    if (this._rcWrapper.isMetaFile(filePath)) {
      await remove(join(outDir!, filePath))
    }
  }

  /**
   * Performs pre-tasks before executing a build
   */
  private async _peformInitialTasks (config: tsStatic.ParsedCommandLine) {
    /**
     * Step 1: Cleanup build directory
     */
    await this._cleanupBuildDir(config.options.outDir!)

    /**
     * Step 2: Copy files defined inside `rcFile.copyToBuild`
     */
    await this._copyFiles(this._rcWrapper.getMetaPatterns(), config.options.outDir!)
  }

  /**
   * Builds the typescript project
   */
  public async build (serveApp: boolean = false) {
    const config = this._parseConfig()
    if (!config) {
      return
    }

    /**
     * Step 1: Peform cleanup and copy static files
     */
    await this._peformInitialTasks(config)

    /**
     * Step 2: Build project using Typescript compiler
     */
    this._compiler.on('initial:build', (hasError, diagnostics) => {
      if (hasError || diagnostics.length) {
        fancyLogs.error('Build failed')
        this._processBuildDiagnostics(diagnostics, config.options)
        return
      }

      fancyLogs.success('Build succeeded')

      /**
       * Step 3: Optionally, start the HTTP server when `startServer` is set to true
       */
      if (serveApp) {
        fancyLogs.start('Starting HTTP server')
        new HttpServer(`${config.options.outDir}/server.js`, this.projectRoot, this._nodeArgs).start()
      }
    })

    fancyLogs.info('Compiling typescript files. It may take a while...')
    this._compiler.build(config)
  }

  /**
   * Builds the typescript project for production
   */
  public async buildForProduction (client: 'npm' | 'yarn') {
    const config = this._parseConfig()
    if (!config) {
      return
    }

    /**
     * Moving package file to the build directory as well for production builds.
     * In case of `npm` being the client, we also move `package-lock.json`
     * file.
     */
    this._rcWrapper.addMetaFile({ pattern: 'package.json', reloadServer: false })
    if (client === 'npm') {
      this._rcWrapper.addMetaFile({ pattern: 'package-lock.json', reloadServer: false })
    }

    /**
     * Step 1: Peform cleanup and copy static files
     */
    await this._peformInitialTasks(config)

    /**
     * Step 2: Build project using Typescript compiler
     */
    this._compiler.on('initial:build', (hasError, diagnostics) => {
      if (hasError || diagnostics.length) {
        fancyLogs.error('Build failed')
        this._processBuildDiagnostics(diagnostics, config.options)
        return
      }

      fancyLogs.success('Build succeeded')

      /**
       * Step 3: Install dependencies for production
       */
      const suffix = `${client === 'npm' ? 'npm' : 'yarn'} install --production`
      fancyLogs.info({ message: 'install dependencies', suffix })
      new Installer(config.options.outDir!, client, true).install()
    })

    fancyLogs.info('Compiling typescript files. It may take a while...')
    this._compiler.build(config)
  }

  /**
   * Build the project and start watcher for incremental builds
   */
  public async watch (serveApp: boolean = true) {
    const config = this._parseConfig()
    if (!config) {
      return
    }

    /**
     * Reference to HTTP server
     */
    const httpServer = serveApp
      ? new HttpServer(`${config.options.outDir}/server.js`, this.projectRoot, this._nodeArgs)
      : new DummyHttpServer(`${config.options.outDir}/server.js`, this.projectRoot, this._nodeArgs)

    /**
     * Step 1: Peform cleanup and copy static files
     */
    await this._peformInitialTasks(config)

    /**
     * Handle initial:build event to print diagnostics
     */
    this._compiler.on('initial:build', (hasError, diagnostics) => {
      if (hasError || diagnostics.length) {
        fancyLogs.error('Build failed')
        this._processBuildDiagnostics(diagnostics, config.options)
        return
      }

      fancyLogs.success('Build succeeded')
      fancyLogs.watch('Watching for file changes and they will be recompiled on every save')

      if (serveApp) {
        fancyLogs.start('Starting HTTP server')
        httpServer.start()
      }
    })

    /**
     * Handle subsequent:build event to print diagnostics and restart
     * the HTTP server.
     */
    this._compiler.on('subsequent:build', (filePath, hasError, diagnostics) => {
      clearScreen()

      if (hasError || diagnostics.length) {
        this._processBuildDiagnostics(diagnostics, config.options)
        return
      }

      fancyLogs.compile(filePath)
      httpServer.restart()
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
      this._handleFileRemoval(filePath, config.options.outDir!, httpServer)
    })

    /**
     * Remove the output file when source file is removed
     */
    this._compiler.on('source:unlink', async (filePath) => {
      const outputPath = relative(config.options.rootDir!, filePath).replace(/\.(d)?ts$/, '.js')
      fancyLogs.delete(outputPath)
      await remove(join(config.options.outDir!, outputPath))
      httpServer.restart()
    })

    fancyLogs.info('Compiling typescript files. Initial build may take a while...')

    /**
     * Start watcher
     */
    this._compiler.watch(config, ['.'], {
      ignored: [
        'node_modules/**',
        `${config.options.outDir}/**`,
      ],
    })
  }
}
