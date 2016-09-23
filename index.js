#!/usr/bin/env node
'use strict'

/**
 * adonis-cli
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const argv = require('yargs').argv
const colors = require('colors')
const commands = require('./src/Commands')
const isCommand = function (command) {
  return Object.keys(commands).indexOf(command) > -1
}

/**
 * return if command is not new
 */
if (!argv._ || !isCommand(argv._[0])) {
  console.log(`${colors.bold('Commands')}`)
  console.log(`------------`)
  Object.keys(commands).forEach((command) => {
    console.log(`adonis ${command}`)
  })
  console.log('\n')
} else {
  commands[argv._[0]](argv)
}
