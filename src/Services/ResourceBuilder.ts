
/*
 * @adonisjs/cli
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { ensureDir } from 'fs-extra'
import { pascalCase } from 'change-case'
import { TemplateFile } from '@adonisjs/sink'
import { basename, dirname, join } from 'path'
import { BaseCommand } from '@adonisjs/ace'

import { logCreateAction } from './logger'

const BASE_TEMPLATES_DIR = join(__dirname, '..', '..', 'templates')

/**
 * Makes a resource file inside the user project
 */
export class ResourceBuilder {
  private _basename: string
  private _basedir: string
  private _destinationBaseDir: string
  private _template: string
  private _data: any

  constructor (
    private _command: BaseCommand,
    private _name: string,
    private _resource: string,
  ) {
    this._extractDirectoryAndBasename()
  }

  /**
   * Returns the resource file name
   */
  private _getFileName () {
    return `${this._basename}.ts`
  }

  /**
   * Suffix the name with the resource
   */
  private _addResourceSuffix (name: string) {
    return `${name.replace(new RegExp(`${this._resource.toLowerCase()}$`, 'i'), '')}${this._resource}`
  }

  /**
   * Extracts the base dir and base name from the name user has
   * defined
   */
  private _extractDirectoryAndBasename () {
    this._basename = this._addResourceSuffix(pascalCase(basename(this._name)))
    this._basedir = dirname(this._name)
  }

  /**
   * Define the destination path for creating the resource
   */
  public destinationPath (location: string): this {
    this._destinationBaseDir = join(location, this._basedir)
    return this
  }

  /**
   * Define the template to be used for making the resource
   */
  public useTemplate (template: string, data: any): this {
    this._template = template
    this._data = data
    return this
  }

  /**
   * Make the resource
   */
  public async make () {
    await ensureDir(this._destinationBaseDir)

    const resource = new TemplateFile(
      this._destinationBaseDir,
      this._getFileName(),
      join(BASE_TEMPLATES_DIR, this._template),
    )

    /**
     * Return early when resource file already exists
     */
    if (resource.exists()) {
      this._command.$error(`${join(this._basedir, this._getFileName())} file already exists`)
      return
    }

    resource
      .apply(Object.assign(this._data, { resourceName: this._basename }))
      .commit()

    logCreateAction(join(this._basedir, this._getFileName()))
  }
}
