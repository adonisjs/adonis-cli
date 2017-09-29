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
    return `
    serve
    { --dev : Start development server }
    { -w, --watch=@value : A custom set of only files to watch },
    { --debug: Start server in debug mode }
    `
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
   * Console message when server started
   *
   * @method started
   *
   * @package {Boolean} dev
   *
   * @return {void}
   */
  started (dev, debug) {
    const message = `Started server
Watcher: ${dev ? this.chalk.green('On') : this.chalk.red('Off')}
Debugger: ${debug ? 'Visit ' + this.chalk.yellow('chrome://inspect') + ' to open devtools' : this.chalk.red('Off')}`

    console.log(require('boxen')(message, {
      dimBorder: true,
      align: 'left',
      padding: {
        left: 4,
        right: 4,
        top: 1,
        bottom: 1
      },
      borderColor: 'yellow'
    }))
  }

  /**
   * This method is executed when nodemon restarts
   *
   * @method onRestart
   *
   * @param  {Array}  files
   *
   * @return {void}
   */
  onRestart (files) {
    if (files.length > 1) {
      console.log(this.chalk.magenta('File(s) changed'))
      files.forEach((file) => console.log(file.replace(process.cwd(), '').replace(path.sep, '')))
    } else {
      const fileName = files[0].replace(process.cwd(), '').replace(path.sep, '')
      console.log(`${this.chalk.magenta('changed')} ${fileName}`)
    }
  }

  /**
   * Message to log on crash
   *
   * @method onCrash
   *
   * @return {void}
   */
  onCrash () {
    this.error('Application crashed, make sure to kill all related running process, fix the issue and re-run the app')
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
  async handle (args, { dev, watch, debug }) {
    const acePath = path.join(process.cwd(), 'ace')
    const appFile = path.join(process.cwd(), 'server.js')
    const exists = await this.pathExists(acePath)

    if (!exists) {
      this.error('Make sure you are inside an adonisjs app to start the server')
      return
    }

    /**
     * If user has defined files to watch, then switch to
     * dev version automatically
     */
    if (watch && typeof (watch) === 'string') {
      watch = watch.split(',').map((item) => item.trim())
      dev = true
    }

    /**
     * The file extensions only when dev mode
     * is true
     */
    const ext = dev ? 'js json' : 'null'

    /**
     * Directories to watch
     */
    const watchDirs = watch || (dev ? [process.cwd(), '.env'] : [])

    const nodemon = require('nodemon')
    nodemon({
      script: appFile,
      execMap: {
        js: debug ? 'node --inspect' : 'node'
      },
      ext: ext,
      ignore: ['tmp/*', 'public/*'],
      watch: watchDirs
    })

    this.started(dev, debug)

    /**
     * Listeners
     */
    nodemon.on('restart', this.onRestart.bind(this))
    nodemon.on('crash', this.onCrash.bind(this))
  }
}

module.exports = Serve
