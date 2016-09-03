'use strict'

/**
 * adonis-cli
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const path = require('path')
const fs = require('fs')
const colors = require('colors')

/**
 * creates ace.cmd file for the windows.
 *
 * @param  {String} aceFile
 *
 * @private
 */
const createWindowsAceFile = function (aceFile) {
  const newFile = path.join(path.basename(aceFile).replace('ace', ''), 'ace.cmd')
  const fileContents = `@echo off
node --harmony_proxies ace %*`
  fs.writeFileSync(newFile, fileContents)
}

/**
 * updates ace file with the right node path. Also it
 * will delete the ace.cmd file if exists.
 *
 * @param  {String} aceFile
 * @param  {String} execPath
 */
const updateAceFile = function (aceFile, execPath) {
  const fileContents = `${execPath}
'use strict'
/*
|--------------------------------------------------------------------------
|   Running Console Commands
|--------------------------------------------------------------------------
|
|  Here we invoke console commands registered under Ace store.
|
*/
const kernel = require('./bootstrap/kernel')
kernel()`
  fs.writeFileSync(aceFile, fileContents)
  try {
    fs.unlinkSync(`${aceFile}.cmd`)
  } catch (e) {}
}

module.exports = function (argv, fullPath) {
  if (fullPath == null) {
    fullPath = process.cwd()
  }

  const nodePath = process.env.execPath || '/usr/bin/env node'
  const execPath = `#!${nodePath} --harmony_proxies`
  const acePath = path.join(fullPath, 'ace')
  const packagePath = path.join(fullPath, 'package.json')
  console.log(colors.green(`Fixing ace file`))
  try {
    fs.existsSync(packagePath)
    if (process.platform === 'win32') {
      updateAceFile(acePath, execPath)
      createWindowsAceFile(acePath, execPath)
    } else {
      updateAceFile(acePath, execPath)
    }
  } catch (e) {
    const message = e.code === 'ENOENT' ? 'Make sure you are running this command from the root of adonis project' : e.message
    console.log(colors.red(message))
  }
}
