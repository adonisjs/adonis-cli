'use strict'

/**
 * adonis-cli
 * Copyright(c) 2015-2015 Harminder Virk
 * MIT Licensed
*/

const argv = require('yargs').argv
const colors = require('colors')
const clean = require('./src/Commands/clean')
const clone = require('./src/Commands/clone')
const Spinner = require('cli-spinner').Spinner
const install = require('./src/Commands/install')

const repo = 'https://github.com/adonisjs/adonis-app.git'
let branch = 'master'

/**
 * return if command is not new
 */
if(!argv._ || argv._[0] !== 'new') {
  console.log(colors.red('You can only create a new project using ' + colors.bold.white('new') + ' command'))
  return
}

/**
 * return if project path is not defined
 */
if(!argv._[1]) {
  console.log(colors.red(`define project path \n${colors.bold.white('example:- adonis new yardstick')}`))
  return
}

/**
 * switch to develop branch if --dev option is passed
 * in commandline
 */
if(argv.dev) {
  branch = 'develop'
}

const projectPath = argv._[1]
const spinner = new Spinner(`${colors.green('installing dependencies... %s')}`)

clone(repo, branch, projectPath)
  .then(function () {
    console.log(`${colors.green('cleaning project')}`)
    return clean(projectPath)
  })
  .then(function () {
    spinner.setSpinnerString('|/-\\')
    spinner.start()
    return install(projectPath)
  })
  .then(function (success) {
    spinner.stop(clean)
    console.log(colors.green(`Your project is ready, follow below instructions to get ready \n`))
    console.log(`--------------------------------------`)
    console.log(`   ${colors.bold('GETTING STARTED')}   `)
    console.log(`--------------------------------------`)
    console.log(`1. cd into ${projectPath}`)
    console.log(`2. npm run start`)
    console.log(`\n`)
  })
  .catch(function (error) {
    spinner.stop(clean)
    console.log(colors.red(error.message))
  })
