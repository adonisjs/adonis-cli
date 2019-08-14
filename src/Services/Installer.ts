/*
 * @adonisjs/cli
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import * as execa from 'execa'

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
    const args = this._production ? ['install', '--production'] : ['install']
    const installer = execa('npm', args, {
      buffer: false,
      cwd: this._projectRoot,
      env: { FORCE_COLOR: 'true' },
    })

    installer.stdout!.pipe(process.stdout)
    installer.stderr!.pipe(process.stderr)
  }

  /**
   * Install project dependencies using yarn
   */
  private _yarnInstall () {
    const args = this._production ? ['install', '--production'] : ['install']
    const installer = execa('yarn', args, {
      buffer: false,
      cwd: this._projectRoot,
      env: { FORCE_COLOR: 'true' },
    })

    installer.stdout!.pipe(process.stdout)
    installer.stderr!.pipe(process.stderr)
  }

  /**
   * Creates a new app using `npx`
   */
  private async _npmCreate (projectPath: string) {
    try {
      await execa('npx', ['create-adonis-ts-app', projectPath], {
        cwd: this._projectRoot,
        env: { FORCE_COLOR: 'true' },
      })
    } catch (error) {
      throw error.stderr
    }
  }

  /**
   * Creates a new app using `yarn create`
   */
  private async _yarnCreate (projectPath: string) {
    try {
      await execa('yarn', ['create', 'adonis-ts-app', projectPath], {
        cwd: this._projectRoot,
        env: { FORCE_COLOR: 'true' },
      })
    } catch (error) {
      throw error.stderr
    }
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
  public createApp (projectPath: string) {
    if (this._client === 'yarn') {
      return this._yarnCreate(projectPath)
    }

    return this._npmCreate(projectPath)
  }
}
