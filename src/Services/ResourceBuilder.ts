
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
import fancyLogs from '@poppinss/fancy-logs'
import { TemplateFile } from '@adonisjs/sink'
import { basename, dirname, join } from 'path'

const BASE_TEMPLATES_DIR = join(__dirname, '..', '..', 'templates')

/**
 * Makes a resource file inside the user project
 */
export class ResourceBuilder {
  /**
   * Base name of the file by defined the user
   */
  private _fileName: string

  /**
   * Literal name for the resource to be created
   */
  private _resourceName: string

  /**
   * Base dir is the incremental path defined by the user.
   * `projectRoot` + `conventionalDir` + `this._baseDir` makes
   * the absolute path.
   */
  private _basedir: string

  /**
   * The conventional location for the resource. This must be the relative
   * path from the project root
   */
  private _location: string

  /**
   * The template to use
   */
  private _template: string

  /**
   * Template data
   */
  private _data: any

  constructor (private _projectRoot: string, inputName: string, resource?: string) {
    const name = pascalCase(basename(inputName))
    this._resourceName = resource ? this._addResourceSuffix(name, resource) : name
    this._fileName = `${this._resourceName}.ts`
    this._basedir = dirname(inputName)
  }

  /**
   * Suffix the name with the resource
   */
  private _addResourceSuffix (name: string, resource: string) {
    return `${name.replace(new RegExp(`${resource.toLowerCase()}$`, 'i'), '')}${resource}`
  }

  /**
   * Define the destination path for creating the resource
   */
  public destinationPath (location: string): this {
    this._location = location
    return this
  }

  /**
   * Define the template to be used for making the resource
   */
  public useTemplate (template: string, data: any): this {
    this._template = join(BASE_TEMPLATES_DIR, template)
    this._data = data
    return this
  }

  /**
   * Define a custom base name
   */
  public setFileName (name: string): this {
    this._fileName = name
    return this
  }

  /**
   * Define a custom resource name
   */
  public setResourceName (name: string): this {
    this._resourceName = name
    return this
  }

  /**
   * Make the resource
   */
  public async make () {
    const destinationDir = join(this._projectRoot, this._location, this._basedir)
    const fileNameForLogs = join(this._basedir, this._location, this._fileName)
    await ensureDir(destinationDir)

    const resource = new TemplateFile(destinationDir, this._fileName, this._template)

    /**
     * Return early when resource file already exists
     */
    if (resource.exists()) {
      fancyLogs.error(`${fileNameForLogs} file already exists`)
      return
    }

    resource
      .apply(Object.assign(this._data, { resourceName: this._resourceName }))
      .commit()

    fancyLogs.create(fileNameForLogs)
  }
}
