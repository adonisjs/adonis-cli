#!/usr/bin/env node --harmony-async-await
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

const ace = require('./lib/ace')

// register internal commands
Commands.forEach((Command) => {
  ace.addCommand(Command)
})

// require user project .ace file
try {
  require(path.join(process.cwd(), 'ace'))
} catch (error) {
  ace.wireUpWithCommander()
  ace.invoke()
}
