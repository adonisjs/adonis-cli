/*
 * @adonisjs/cli
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import * as execa from 'execa'
import { getChildProcessEnvVariables } from './helpers'

/**
 * Exposes the API to start Node.js HTTP server as a child process. The
 * child process is full managed and cleans up when parent process
 * dies.
 */
export class HttpServer {
  private _httpServer: execa.ExecaChildProcess

  constructor (
    private _sourceFile: string,
    private _projectRoot: string,
  ) {}

  get isConnected () {
    return this._httpServer && this._httpServer.connected && !this._httpServer.killed
  }

  /**
   * Start the HTTP server as a child process.
   */
  public start () {
    if (this.isConnected) {
      throw new Error('Http server is already connected. Call restart instead')
    }

    this._httpServer = execa.node(this._sourceFile, [], {
      buffer: false,
      cwd: this._projectRoot,
      env: getChildProcessEnvVariables(),
    })

    /**
     * Pipe the output
     */
    this._httpServer.stdout!.pipe(process.stdout)
    this._httpServer.stderr!.pipe(process.stderr)
  }

  /**
   * Restart the server by killing the old one
   */
  public restart () {
    if (this._httpServer) {
      this._httpServer.kill('SIGKILL')
    }
    this.start()
  }
}
