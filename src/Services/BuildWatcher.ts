/*
* @adonisjs/cli
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import { extname } from 'path'
import chokidar from 'chokidar'
import fancyLogs from '@poppinss/fancy-logs'
import { RcFile } from '@ioc:Adonis/Core/Application'

import { HttpServer } from './HttpServer'
import { SEVER_ENTRY_FILE } from '../helpers'
import { RcFileWrapper } from './RcFileWrapper'

/**
 * Exposes the API to watch the build folder and restart the
 * HTTP server
 */
export class BuildWatcher {
  private _httpServer: HttpServer
  private _rcWrapper = new RcFileWrapper(this.projectRoot, this._rcFile)

  constructor (
    public projectRoot: string,
    private _rcFile: RcFile,
    private _nodeArgs: string[],
  ) {
  }

  /**
   * Restarts the HTTP server
   */
  private _restartServer (filePath: string) {
    if (['.js', '.json'].includes(extname(filePath)) || this._rcWrapper.isReloadServerFile(filePath)) {
      fancyLogs.info('changed', filePath)
      this._httpServer.restart()
    }
  }

  /**
   * Watch for file changes and start/restart the HTTP server
   */
  public async watch (buildDir: string) {
    this._httpServer = new HttpServer(SEVER_ENTRY_FILE, buildDir, this._nodeArgs)

    const watcher = chokidar.watch(['.'], {
      ignoreInitial: true,
      cwd: buildDir,
      ignored: [
        'node_modules/**',
      ],
    })

    watcher.on('add', (filePath: string) => this._restartServer(filePath))
    watcher.on('change', (filePath: string) => this._restartServer(filePath))
    watcher.on('unlink', (filePath: string) => this._restartServer(filePath))
    watcher.on('ready', () => {
      fancyLogs.watch('Watching for build file changes')
      fancyLogs.start('Starting HTTP server')
      this._httpServer.start()
    })
  }
}
