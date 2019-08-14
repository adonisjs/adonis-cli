/*
* @adonisjs/cli
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import * as semver from 'semver'

/**
 * Returns a boolean telling if current Node.js version satisfies
 * the minimum required Node version.
 */
export function satisfiesNodeVersion (): boolean {
  const version = process.version
  const parsedVersion = semver.parse(version)
  return !!(parsedVersion && parsedVersion.major >= 10)
}
