/*
 * @adonisjs/cli
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import execa from 'execa'
import { getChildProcessEnvVariables } from './helpers'

/**
 * Installer installs project dependencies using npm or yarn.
 */
export class Installer {
  constructor (
    private _projectRoot: string,
    private _client: 'npm' | 'yarn',
    private _production: boolean,
  ) {}

  /**
   * Install project dependencies using npm
   */
  private _npmInstall () {
    const args = this._production ? ['ci', '--production'] : ['install']
    execa('npm', args, {
      buffer: false,
      stdio: 'inherit',
      cwd: this._projectRoot,
      env: getChildProcessEnvVariables(this._projectRoot),
    })
  }

  /**
   * Install project dependencies using yarn
   */
  private _yarnInstall () {
    const args = this._production ? ['install', '--production'] : ['install']
    execa('yarn', args, {
      buffer: false,
      stdio: 'inherit',
      cwd: this._projectRoot,
      env: getChildProcessEnvVariables(this._projectRoot),
    })
  }

  /**
   * Creates a new app using `npx`
   */
  private _npmCreate (projectPath: string, args?: string[]) {
    execa('npx', ['create-adonis-ts-app', projectPath].concat(args || []), {
      buffer: false,
      stdio: 'inherit',
      cwd: this._projectRoot,
      env: getChildProcessEnvVariables(this._projectRoot),
    })
  }

  /**
   * Creates a new app using `yarn create`
   */
  private _yarnCreate (projectPath: string, args?: string[]) {
    execa('yarn', ['create', 'adonis-ts-app', projectPath].concat(args || []), {
      buffer: false,
      stdio: 'inherit',
      cwd: this._projectRoot,
      env: getChildProcessEnvVariables(this._projectRoot),
    })
  }

  /**
   * Start installing project dependencies.
   */
  public install () {
    if (this._client === 'yarn') {
      this._yarnInstall()
      return
    }

    this._npmInstall()
  }

  /**
   * Create a new application
   */
  public createApp (projectPath: string, args?: string[]) {
    if (this._client === 'yarn') {
      return this._yarnCreate(projectPath, args)
    }

    return this._npmCreate(projectPath, args)
  }
}
