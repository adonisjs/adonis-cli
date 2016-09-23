'use strict'

/**
 * adonis-cli
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const colors = require('colors')
const execSync = require('child_process').execSync
const semver = require('semver')

const requiredNodeVersion = '>=4.0.0'
const requiredNpmVersion = '>=3.0.0'

module.exports = function (argv) {
  const nodejsVersion = process.version.replace('v', '')
  const npmVersion = execSync('npm -v', {input: 'string', 'encoding': 'utf-8'})

  console.log('-----------AdonisJs requirements check--------------')
  console.log(`${colors.green('AdonisJs needs Node.JS ' + requiredNodeVersion + ' and npm ' + requiredNpmVersion + '\n')}`)
  console.log(`${colors.green('verifying node.js and npm current installed versions...')}`)

  console.log('\nYour current Node.JS version: ' + colors.yellow(nodejsVersion))
  console.log('Your current npm version: ' + colors.yellow(npmVersion))

  if (!semver.satisfies(nodejsVersion, requiredNodeVersion)) {
    console.log(`${colors.red('\nYour current Node.js version does not met AdonisJs requirements.')}`)
    console.log(`${colors.red('Please update your Node.JS version before continue.')}`)
    return
  }

  if (!semver.satisfies(npmVersion, requiredNpmVersion)) {
    console.log(`${colors.red('\nYour Current npm version does not met AdonisJs requirements.')}`)
    console.log(`${colors.red('Please update your npm version with this command: ')}`)
    console.log(`${colors.yellow('npm install -g npm')}`)
    return
  }

  if (!semver.satisfies(nodejsVersion, requiredNodeVersion) || !semver.satisfies(npmVersion, requiredNpmVersion)) {
    return false
  }

  return true
}
