'use strict'

/**
 * adonis-cli
 * Copyright(c) 2015-2015 Harminder Virk
 * MIT Licensed
*/

const shell = require('shelljs')

/**
 * @description installs all dependencies inside the project
 * root using npm install command
 * @method exports
 * @param  {String} insidePath
 * @return {Object}
 * @public
 */
module.exports = function (insidePath) {
  return new Promise(function (resolve, reject) {
    shell.exec(`cd ${insidePath} && npm install --no-optional`, function (error) {
      if (error) {
        reject(error)
      } else {
        resolve(`installed dependencies inside ${insidePath}`)
      }
    })
  })
}
