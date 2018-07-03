'use strict'

/**
 * adonis-cli
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const debug = require('debug')('adonis:cli')
const isGitUrl = require('is-git-url')

/**
 * This module clones a given github repo and branch.
 *
 * @method
 *
 * @param  {String} blueprint
 * @param  {String} appPath
 * @param  {Object} stepsCounter
 * @param  {String} [branch = null]
 *
 * @return {void}
 */
module.exports = async function (blueprint, appPath, stepsCounter, branch = null) {
  const step = stepsCounter.advance('Cloning project blueprint', 'inbox_tray', blueprint)
  step.start()

  let cloneCommand = 'git clone --depth=1'

  /**
   * Add branch flag when branch is defined
   */
  if (branch) {
    cloneCommand = `${cloneCommand}  --branch ${branch}`
  }

  // complete the clone command
  // check if ths a full .git path
  if (isGitUrl(blueprint)) {
    cloneCommand = `${cloneCommand} ${blueprint} "${appPath}"`
  } else {
    cloneCommand = `${cloneCommand} https://github.com/${blueprint}.git "${appPath}"`
  }
  debug('clone command %s', cloneCommand)

  try {
    await require('./exec')(cloneCommand)
    step.success('Cloned')
  } catch (error) {
    step.error('Unable to clone repo', 'x')
    throw error
  }
}
