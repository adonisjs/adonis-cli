'use strict'

/**
 * adonis-cli
 * Copyright(c) 2015-2015 Harminder Virk
 * MIT Licensed
*/

const path = require('path')
const rimraf = require('rimraf')

/**
 * @description removes .git directory from project
 * root it is required to make sure the end user
 * does not ends up with original repo as the
 * remote origin
 * @method exports
 * @param  {String} fromPath
 * @return {Object}
 * @public
 */
module.exports = function (fromPath) {
  const gitFolder = path.join(fromPath, '.git')
  return new Promise(function (resolve, reject) {
    rimraf(gitFolder, function (error) {
      if (error) {
        reject(error)
      } else {
        resolve(`removed ${gitFolder}`)
      }
    })
  })
}
