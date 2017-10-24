'use strict'

/*
 * adonis-cli
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

/**
 * Exporting a list of internal commands
 *
 * @type {Array}
 */
module.exports = {
  new: require('./New'),
  install: require('./Install'),
  serve: require('./Serve'),
  setup: require('./Setup'),
  'key:generate': require('./KeyGenerate'),
  'make:controller': require('./Make/Controller'),
  'make:model': require('./Make/Model'),
  'make:view': require('./Make/View'),
  'make:middleware': require('./Make/Middleware'),
  'make:command': require('./Make/Command'),
  'make:exception': require('./Make/Exception'),
  'make:hook': require('./Make/Hook'),
  'make:migration': require('./Make/Migration'),
  'make:listener': require('./Make/Listener'),
  'repl': require('./Repl'),
  'make:ehandler': require('./Make/ExceptionHandler'),
  'make:seed': require('./Make/Seed'),
  'route:list': require('./RouteList'),
  'run:instructions': require('./Instructions')
}
