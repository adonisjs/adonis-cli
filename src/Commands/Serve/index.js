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
    { -e, --ext=@value : A custom set of extensions to watch. In development, they will be merged with the default .js and .json },
    { -i, --ignore=@value : A custom set of folders to ignore watching },
    { -p, --polling : Use polling to find file changes. Also required when using Docker }
    { --debug?=@value: Start server in debug mode }
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
    console.log('')
    console.log(`${this.chalk.bgGreen.black(' SERVER STARTED ')}`)
    if (debug) {
      console.log(`> Visit chrome://inspect to debug your app`)
    }
    if (dev) {
      console.log(`> Watching files for changes...`)
    }
    console.log('')
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
   * Listening for on quite event
   *
   * @method onQuit
   *
   * @param  {String} domain
   *
   * @return {void}
   */
  onQuit () {
    process.exit(0)
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
  async handle (args, { dev, watch, debug, ignore, polling, ext }) {
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
    if (dev) {
      ext = `${ext || ''} js json`
    } else {
      ext = ext || 'null'
    }

    /**
     * Directories to watch
     */
    const watchDirs = watch || (dev ? [process.cwd(), '.env'] : [])

    /**
     * Custom debug port
     */
    let execJsCommand = 'node'
    if (debug) {
      execJsCommand += ' --inspect'
      if (typeof (debug) === 'string') {
        execJsCommand += '=' + debug
      }
    }

    const nodemon = require('nodemon')

    nodemon({
      script: appFile,
      execMap: {
        js: execJsCommand
      },
      ext: ext,
      legacyWatch: !!polling,
      ignore: ['/tmp/*', '/resources/*', '/public/*'].concat(ignore || []).map((folder) => `${process.cwd()}/${folder}`),
      watch: watchDirs,
      stdin: false
    })

    this.started(dev, debug)

    /**
     * Listeners
     */
    nodemon
      .on('restart', this.onRestart.bind(this))
      .on('crash', this.onCrash.bind(this))
      .on('quit', () => (this.onQuit()))
  }
}

module.exports = Serve
