'use strict'

/*
 * adonis-cli
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const BaseCommand = require('../Base')

/**
 * Start the repl server session
 *
 * @class RouteList
 * @constructor
 */
class RouteList extends BaseCommand {
  static get inject () {
    return ['Adonis/Src/Route']
  }

  /**
   * The command signature used by ace
   *
   * @method signature
   *
   * @return {String}
   */
  static get signature () {
    return 'route:list'
  }

  /**
   * The command description used by ace
   *
   * @method description
   *
   * @return {String}
   */
  static get description () {
    return 'List all registered routes'
  }

  constructor (Route) {
    super()
    this.Route = Route
  }

  /**
   * Returns stringfied version of a function
   *
   * @method _toString
   *
   * @param  {Function} fn
   *
   * @return {String}
   *
   * @private
   */
  _toString (fn) {
    return typeof (fn) === 'string' ? fn : 'Closure'
  }

  /**
   * Returns the route row for the table
   *
   * @method _getRow
   *
   * @param  {Object}       route
   *
   * @return {Array}
   */
  _getRow (route) {
    const routeJson = route.toJSON()

    return [
      routeJson.route,
      routeJson.verbs.join(','),
      this._toString(routeJson.handler),
      routeJson.middleware.map((middleware) => this._toString(middleware)).join(','),
      routeJson.name,
      routeJson.domain || ''
    ]
  }

  /**
   * Method executed by ace to list all routes
   *
   * @method handle
   *
   * @return {void}
   */
  async handle () {
    this.invoke(async () => {
      await this.ensureInProjectRoot()

      this.table(
        ['Route', 'Verb(s)', 'Handler', 'Middleware', 'Name', 'Domain'],
        this.Route.list().map(this._getRow.bind(this))
      )
    })
  }
}

module.exports = RouteList
