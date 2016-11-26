'use strict'

/**
 * adonis-cli
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const clean = require('../../lib/clean')
const setKey = require('../../lib/setKey')
const colors = require('colors')
const path = require('path')
const install = require('../../lib/install')
const clone = require('../../lib/clone')
const fix = require('./fix')
const check = require('./check')
const Spinner = require('cli-spinner').Spinner

const repo = 'https://github.com/adonisjs/adonis-app.git'
let branch = 'master'

module.exports = function (argv) {
  /**
   * switch to develop branch if --dev option is passed
   * in commandline
   */
  if (argv.dev) {
    branch = 'develop'
  }

  /**
   * return if project path is not defined
   */
  if (!argv._[1]) {
    console.log(colors.red(`Define project path \n${colors.bold.white('example:- adonis new yardstick')}`))
    return
  }

  if (!check(argv)) {
    console.log(colors.yellow(`\nInstall stopped. Please check error above.`))
    return
  }

  const projectPath = argv._[1]
  const fullPath = path.isAbsolute(projectPath) ? projectPath : path.join(process.cwd(), projectPath)
  console.log(colors.yellow('Project path:'), colors.white(fullPath))
  const spinner = new Spinner(`${colors.green('Installing dependencies... %s')}`)
  clone(repo, branch, projectPath)
  .then(function () {
    console.log(`${colors.white('Cleaning project...')}`)
    return clean(fullPath)
  })
  .then(function () {
    console.log(`${colors.white('Setting up app key...')}`)
    return setKey(fullPath)
  })
  .then(function () {
    fix(argv, fullPath)
    /**
     * Install via npm when `--skip-npm` flag has not
     * been passed.
     */
    if (!argv.skipNpm) {
      spinner.setSpinnerString('|/-\\')
      spinner.start()
      console.log(`${colors.cyan('Installing dependencies may take a while')}`)
      return install(fullPath)
    }
    console.log(`${colors.cyan('Skipping npm install as instructed')}`)
    return true
  })
  .then(function () {
    spinner.stop(clean)
    console.log(colors.green(`Your project is ready, follow below instructions to get ready`))
    console.log(`--------------------------------------`)
    console.log(`   ${colors.bold('GETTING STARTED')}   `)
    console.log(`--------------------------------------`)
    console.log(`1. cd ${projectPath}`)
    console.log(`2. npm run dev`)
    console.log(`\n`)
  })
  .catch(function (error) {
    spinner.stop(clean)
    console.log(colors.red(error.message))
  })
}
