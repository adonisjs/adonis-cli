'use strict'

/*
 * adonis-cli
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const awaitOutside = require('adonis-await-outside')
const fs = require('fs')
const os = require('os')
const path = require('path')
const { Command } = require('../../../lib/ace')

const historyFile = path.join(os.homedir(), '/.adonis_repl_history')

/**
 * Serve the application using forever
 *
 * @class Serve
 * @constructor
 */
class Repl extends Command {
  /**
   * The command signature used by ace
   *
   * @method signature
   *
   * @return {String}
   */
  static get signature () {
    return 'repl'
  }

  /**
   * The command description used by ace
   *
   * @method description
   *
   * @return {String}
   */
  static get description () {
    return 'Start a new repl session'
  }

  /**
   * Reads the history file
   *
   * @param  {Object} repl
   */
  readHistoryFile (repl) {
    try {
      fs.statSync(historyFile)
      repl.rli.history = fs.readFileSync(historyFile, 'utf-8').split('\n').reverse()
      repl.rli.history.shift()
      repl.rli.historyIndex = -1
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * Save the history to the history file.
   *
   * @param {Object} repl
   */
  addHistorySaveListener (repl) {
    const fd = fs.openSync(historyFile, 'a')
    repl.rli.addListener('line', (code) => {
      if (code && code !== '.history') {
        fs.write(fd, `${code}\n`, (error) => { if (error) console.log(error) })
        return
      }
      repl.rli.historyIndex++
      repl.rli.history.pop()
    })

    process.on('exit', function () {
      fs.closeSync(fd)
    })
  }

  /**
   * Method executed by ace to start the command line
   * repl
   *
   * @method handle
   *
   * @return {void}
   */
  async handle () {
    const server = require('repl').start()

    if (typeof (global.use) === 'undefined') {
      this.info('You are running repl outside of Adonisjs app')
    } else {
      server.context.use = global.use
      server.context.make = global.make
    }

    this.readHistoryFile(server)
    this.addHistorySaveListener(server)
    awaitOutside.addAwaitOutsideToReplServer(server)
  }
}

module.exports = Repl
