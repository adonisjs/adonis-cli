'use strict'

/**
 * adonis-cli
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const Steps = require('cli-step')

/**
 * Raw steps are used when user want to disable all animations.
 *
 * @class RawStep
 */
class RawStep {
  constructor (counter, text, helpText) {
    this.stepCounter = counter
    this.text = text
    this.helpText = helpText
  }

  /**
   * Start step
   *
   * @method start
   *
   * @chainable
   */
  start () {
    console.log(`Step ${this.stepCounter}`)
    console.log(`  ├── ${this.text} (${this.helpText})`)
    return this
  }

  /**
   * Mark step as successful
   *
   * @method success
   *
   * @param  {String} text
   *
   * @return {void}
   */
  success (text) {
    console.log(`  ├── SUCCESS: ${text || this.text} (${this.helpText})`)
  }

  /**
   * Mark step as errored
   *
   * @method error
   *
   * @param  {String} text
   *
   * @return {void}
   */
  error (text) {
    console.log(`  ├── ERROR: ${text || this.text} (${this.helpText})`)
  }
}

/**
 * Raw steps is a collection of Raw step. The API has to be
 * compatible with `cli-step`.
 *
 * @class RawSteps
 */
class RawSteps {
  constructor () {
    this.counter = 0
  }

  /**
   * Move to next step. Also the icon param is swalled, since raw output
   * doesn't display emojis.
   *
   * @method advance
   *
   * @param  {String} text
   * @param  {String} icon
   * @param  {String} helpText
   *
   * @return {void}
   */
  advance (text, icon, helpText) {
    this.counter++
    return new RawStep(this.counter, text, helpText)
  }
}

module.exports = { RawSteps, Steps }
