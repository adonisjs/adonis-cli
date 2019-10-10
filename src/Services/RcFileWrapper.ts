/*
* @adonisjs/cli
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import { join } from 'path'
import QuickLRU from 'quick-lru'
import nanomatch from 'nanomatch'
import { RcFile } from '@ioc:Adonis/Core/Application'

/**
 * Exposes the API to match against the globs defined inside the `.adonisrc.json`
 * file and take actions when a file matches a define glob pattern
 */
export class RcFileWrapper {
  /**
   * A list of patterns to globs defined inside `.adonisrc.json`
   * file
   */
  private _metaFilePatterns: string[] = []
  private _metaFileAbsolutePatterns: string[] = []
  private _metaFilesCache = new QuickLRU({ maxSize: 1000 })

  /**
   * A subset of patterns on which we want to reload the HTTP server
   */
  private _reloadServerPatterns: string[] = []
  private _reloadServerAbsolutePatterns: string[] = []
  private _readServerFilesCache = new QuickLRU({ maxSize: 500 })

  constructor (private _projectRoot: string, private _rcFile: RcFile) {
    this._computeFilePattern()
  }

  /**
   * Computes certain patterns for the rcFile
   */
  private _computeFilePattern () {
    this._rcFile.metaFiles.forEach((file) => this._addFile(file))
  }

  /**
   * Stores file patterns for given meta file. Most of the redundant work
   * is done for speed, since these paths are quite often checked
   * by the file watcher
   */
  private _addFile (file: { pattern: string, reloadServer: boolean }) {
    if (this._metaFilePatterns.includes(file.pattern)) {
      return
    }

    this._metaFilePatterns.push(file.pattern)
    this._metaFileAbsolutePatterns.push(join(this._projectRoot, file.pattern))

    if (file.reloadServer) {
      this._reloadServerPatterns.push(file.pattern)
      this._reloadServerAbsolutePatterns.push(join(this._projectRoot, file.pattern))
    }
  }

  /**
   * Returns meta files
   */
  public getMetaPatterns (absolute = false) {
    return absolute ? this._metaFileAbsolutePatterns : this._metaFilePatterns
  }

  /**
   * Returns reload server files
   */
  public getReloadServerPatterns (absolute = false) {
    return absolute ? this._reloadServerAbsolutePatterns : this._reloadServerPatterns
  }

  /**
   * Add a new meta file on demand
   */
  public addMetaFile (file: { pattern: string, reloadServer: boolean }) {
    this._rcFile.metaFiles.push(file)
    this._addFile(file)
  }

  /**
   * Returns a boolean telling if file is part of meta file
   * patterns
   */
  public isMetaFile (filePath: string, absolute: boolean = false): boolean {
    if (this._metaFilesCache.has(filePath)) {
      return this._metaFilesCache.get(filePath)
    }

    const isMatch = nanomatch.isMatch(
      filePath,
      absolute ? this._metaFileAbsolutePatterns : this._metaFilePatterns,
    )

    this._metaFilesCache.set(filePath, isMatch)
    return isMatch
  }

  /**
   * Returns a boolean telling if file path needs a server reload
   * or not
   */
  public isReloadServerFile (filePath: string, absolute: boolean = false): boolean {
    if (this._readServerFilesCache.has(filePath)) {
      return this._readServerFilesCache.get(filePath)
    }

    const isMatch = nanomatch.isMatch(
      filePath,
      absolute ? this._reloadServerAbsolutePatterns : this._reloadServerPatterns,
    )

    this._readServerFilesCache.set(filePath, isMatch)
    return isMatch
  }
}
