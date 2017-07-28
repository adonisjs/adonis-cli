#!/usr/bin/env node
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
const Commands = require('./src/Commands')
const commandNames = []

const ace = require('./lib/ace')

// register internal commands
Object.keys(Commands).forEach((name) => {
  commandNames.push(name)
  ace.addCommand(Commands[name])
})

// require user project .ace file
try {
  const command = process.argv[2]
  if (commandNames.indexOf(command) > -1 && command !== 'repl') {
    ace.wireUpWithCommander()
    ace.invoke()
  } else {
    require(path.join(process.cwd(), 'ace'))
  }
} catch (error) {
  ace.wireUpWithCommander()
  ace.invoke()
}
