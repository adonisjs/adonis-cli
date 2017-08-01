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
const os = require('os')
const opn = require('opn')
const marked = require('marked')
const css = require('./instructionsCss')

/**
 * Returns the html to be saved inside tmp file
 * and show it to the user
 *
 * @method html
 *
 * @param  {String} css
 * @param  {String} moduleName
 * @param  {String} content
 *
 * @return {String}
 */
const html = function (css, moduleName, content) {
  return `<html>
  <head>
    <style type="text/css">${css}</style>
  </head>
  <body>
    <article class="markdown-body">
      <h1> Setup instructions for
        <a href="https://npmjs.org/package/${moduleName}" target="_blank">${moduleName}</a>
      </h1>
      ${content}
    </article>
  </body>
  </html>
`
}

/**
 * Render instructions.md file by converting it to
 * HTML and serving by tmp dir.
 *
 * @method
 *
 * @param  {String} modulePath
 * @param  {String} moduleName
 * @param  {Function} readFile
 * @param  {Function} writeFile
 *
 * @return {void}
 */
module.exports = async function (modulePath, moduleName, readFile, writeFile) {
  try {
    const instructions = await readFile(path.join(modulePath, 'instructions.md'), 'utf-8')

    /**
     * Converting instructions markdown to html
     */
    const content = marked(instructions)

    /**
     * Creating html document
     */
    const htmlDocument = html(css, moduleName, content)

    /**
     * Generating path to tmp file
     */
    const tmpFile = path.join(os.tmpdir(), `${new Date().getTime()}.html`)

    /**
     * Writing to tmp file
     */
    await writeFile(tmpFile, htmlDocument)

    /**
     * Opening file
     */
    await opn(tmpFile, { wait: false })
  } catch (error) {
    // ignore error since it's not helpful for enduser
  }
}
