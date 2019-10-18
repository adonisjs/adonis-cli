/*
* @adonisjs/cli
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import { join } from 'path'
import semver from 'semver'
import tsStatic from 'typescript'
import { pathExists } from 'fs-extra'
import { RcFile } from '@ioc:Adonis/Core/Application'
import { rcParser } from '@adonisjs/application/build/standalone'

/**
 * Returns a boolean telling if current Node.js version satisfies
 * the minimum required Node version.
 */
export function satisfiesNodeVersion (): boolean {
  const version = process.version
  const parsedVersion = semver.parse(version)
  return !!(parsedVersion && parsedVersion.major >= 10)
}

/**
 * Returns AdonisJs core version
 */
export function getAdonisCoreVersion (cwd: string): string | null {
  try {
    const pkgPath = require.resolve('@adonisjs/core/package.json', {
      paths: [cwd],
    })
    return require(pkgPath).version
  } catch (error) {
    return null
  }
}

/**
 * Returns AdonisJs core version
 */
export function getCliVersion (): string | null {
  try {
    return require(join(__dirname, '..', '..', '..', 'package.json')).version
  } catch (error) {
    return null
  }
}

/**
 * Returns the env variables to be set inside the child
 * processes.
 */
export function getChildProcessEnvVariables (cwd: string): { [key: string]: string } {
  return {
    FORCE_COLOR: 'true',
    ADONIS_CLI: 'true',
    ADONIS_CLI_VERSION: getCliVersion() || 'NA',
    ADONIS_CLI_CWD: cwd,
  }
}

/**
 * Returns the contents of `.adonisrc.json` file. Returns null when
 * file is missing
 */
export async function getRcContents (projectRoot: string): Promise<null | RcFile> {
  const filePath = join(projectRoot, '.adonisrc.json')
  const hasRcFile = await pathExists(filePath)
  if (!hasRcFile) {
    return null
  }

  return rcParser.parse(require(filePath))
}

/**
 * Clears the console
 */
export function clearScreen () {
  process.stdout.write('\x1B[2J\x1B[3J\x1B[H\x1Bc')
}

/**
 * Formats typescript message as a colorized string
 */
export function reportTsDiagnostics (
  diagnostic: tsStatic.Diagnostic[],
  ts: typeof tsStatic,
  host: tsStatic.CompilerHost,
  pretty: boolean = true,
) {
  if (pretty) {
    console.log(ts.formatDiagnosticsWithColorAndContext(diagnostic, host))
  } else {
    console.log(ts.formatDiagnostics(diagnostic, host))
  }
}

/**
 * Dumps ascii logo to the console
 */
export function dumpAsciiLogo () {
  // tslint:disable-next-line: max-line-length quotemark
  console.log(require('gradient-string').rainbow("    _       _             _         _     \n   / \\   __| | ___  _ __ (_)___    | |___ \n  / _ \\ / _` |/ _ \\| '_ \\| / __|_  | / __|\n / ___ \\ (_| | (_) | | | | \\__ \\ |_| \\__ \\\n/_/   \\_\\__,_|\\___/|_| |_|_|___/\\___/|___/\n"))
}

/**
 * Returns the relative path for a namespace by inspecting
 * all the registered base namespaces.
 *
 * Imagine we have register following base namespaces with their
 * respective directories.
 *
 * App: ./app
 * Contracts: ./contracts
 *
 * When we want the path to `App/Controllers/Http` where `App` is the basenamespace
 * identifier, we will have to path the appropriate basepath and then construct
 * the actual path.
 */
export function getPathForNamespace (autoloads: any, namespace?: string): null | string {
  if (!namespace) {
    return null
  }

  let output: string | null = null
  Object.keys(autoloads).forEach((baseNamespace) => {
    const autoloadPath = autoloads[baseNamespace]
    if (namespace.startsWith(`${baseNamespace}/`)) {
      output = namespace.replace(baseNamespace, autoloadPath)
    }
  })

  return output
}

export const OUTDIR = 'build'
export const SEVER_ENTRY_FILE = 'server.js'
