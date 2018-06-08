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
  new: './New',
  addon: './Addon',
  install: './Install',
  serve: './Serve',
  'key:generate': './KeyGenerate',
  'make:controller': './Make/Controller',
  'make:model': './Make/Model',
  'make:trait': './Make/Trait',
  'make:view': './Make/View',
  'make:middleware': './Make/Middleware',
  'make:command': './Make/Command',
  'make:exception': './Make/Exception',
  'make:hook': './Make/Hook',
  'make:migration': './Make/Migration',
  'make:listener': './Make/Listener',
  'repl': './Repl',
  'make:ehandler': './Make/ExceptionHandler',
  'make:seed': './Make/Seed',
  'route:list': './RouteList',
  'run:instructions': './Instructions'
}
