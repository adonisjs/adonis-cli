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
let ace = null

/**
 * Give preference to the user ace module if
 * command is executed in project root.
 */
try {
  ace = require(path.join(process.cwd(), 'node_modules/@adonisjs/ace'))
} catch (error) {
  ace = require('@adonisjs/ace')
}

module.exports = ace
