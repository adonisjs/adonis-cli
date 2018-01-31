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
const debug = require('debug')('adonis:cli')

const Commands = require('./src/Commands')
const commandNames = []
const needProviders = ['repl', 'route:list', 'run:instructions']

const ace = require('./lib/ace')

// register internal commands
Object.keys(Commands).forEach((name) => {
  commandNames.push(name)
  ace.addCommand(Commands[name])
})

// require user project .ace file
try {
  const command = process.argv[2]
  if (commandNames.indexOf(command) > -1 && needProviders.indexOf(command) <= -1) {
    debug('loading ace from cli')
    ace.wireUpWithCommander()
    ace.invoke(require('./package'))
  } else {
    debug('loading ace from project')
    require(path.join(process.cwd(), 'ace'))
  }
} catch (error) {
  if (error.code !== 'ENOENT' && error.code !== 'MODULE_NOT_FOUND') {
    throw error
  }

  debug('loading ace as fallback from cli')
  ace.wireUpWithCommander()
  ace.invoke(require('./package'))
}
