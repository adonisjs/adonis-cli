'use strict'

/*
 * adonis-cli
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const path = require('path')
const BaseCommand = require('../Base')

class Install extends BaseCommand {
  constructor () {
    super()
    const FakeHelpers = require('@adonisjs/ignitor/src/Helpers')
    this.Helpers = new FakeHelpers(process.cwd())
  }

  /**
   * The command signature
   *
   * @method signature
   *
   * @return {String}
   */
  static get signature () {
    return `
    install
    { module : Npm module name }
    { --as=@value : Name of the module, required when installing from github or local file system }
    { --yarn: Use yarn over npm for installation }
    { --cnpm: Use cnpm over npm for installation }
    { -s, --skip-instructions: Do not run post install instructions }
    { --raw : Disable animations and colored output }
    `
  }

  /**
   * The command description
   *
   * @method description
   *
   * @return {String}
   */
  static get description () {
    return 'Install Adonisjs provider from npm/yarn and run post install instructions'
  }

  async handle ({ module: packageName }, options) {
    const name = options.as || packageName
    const stepsCounter = this.initiateSteps(1, options)

    await this.invoke(async () => {
      await this.ensureInProjectRoot()
      await require('../../Services/install')(options.yarn ? 'yarn' : (options.cnpm ? 'cnpm' : 'npm'), stepsCounter, packageName)

      if (options.skipInstructions) {
        return
      }

      const directory = path.join(process.cwd(), 'node_modules', name)
      await this.call('run:instructions', { directory }, { name })
    })
  }
}

module.exports = Install
