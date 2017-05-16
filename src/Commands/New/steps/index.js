'use strict'

/*
 * adonis-cli
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

module.exports = {
  dumpAsciiLogo: require('./dump-ascii-logo'),
  checkRequirements: require('./check-requirements'),
  verifyExistingApp: require('./verify-existing-app'),
  clone: require('./clone'),
  installDependencies: require('./install-dependencies'),
  copyEnvFile: require('./copy-env-file'),
  generateAppKey: require('./generate-app-key'),
  onBoardUser: require('./on-board-user')
}
