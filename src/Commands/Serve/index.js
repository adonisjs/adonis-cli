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
const { Command } = require('../../../lib/ace')

/**
 * Serve the application using forever
 *
 * @class Serve
 * @constructor
 */
class Serve extends Command {
  /**
   * The command signature used by ace
   *
   * @method signature
   *
   * @return {String}
   */
  static get signature () {
    return 'serve {--dev : Start development server}'
  }

  /**
   * The command description used by ace
   *
   * @method description
   *
   * @return {String}
   */
  static get description () {
    return 'Start Http server'
  }

  /**
   * Method executed by ace to start the HTTP server
   *
   * @method handle
   *
   * @param  {Object} args
   * @param  {Boolean} options.dev
   *
   * @return {void}
   */
  async handle (args, { dev }) {
    const forever = require('forever-monitor')

    const acePath = path.join(process.cwd(), 'ace')
    const appFile = path.join(process.cwd(), 'server.js')
    const exists = await this.pathExists(acePath)

    if (!exists) {
      this.error('Make sure you are inside an adonisjs app to start the server')
      return
    }

    const child = new (forever.Monitor)(appFile, {
      max: 1,
      silent: false,
      watch: dev,
      watchIgnorePatterns: [
        '*.edge',
        '*.md',
        '*.adoc',
        '*.asciidoc',
        'resources',
        'database',
        'public',
        'package.json',
        'package-lock.json',
        '.gitignore',
        'test',
        '.editorconfig',
        'node_modules'
      ],
      watchDirectory: process.cwd()
    })

    console.log('')
    if (dev) {
      console.log(this.chalk.bgBlueBright(' Started server in dev mode '))
    } else {
      console.log(this.chalk.bgBlueBright(' Started server '))
    }
    console.log('')

    child.on('watch:restart', (info) => {
      console.log(`${this.chalk.magenta(info.file)}  ${info.stat.replace(process.cwd(), '').replace(path.sep, '')}`)
    })
    child.start()
  }
}

module.exports = Serve
