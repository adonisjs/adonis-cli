'use strict'

/**
 * adonis-cli
 * Copyright(c) 2015-2015 Harminder Virk
 * MIT Licensed
*/

const path = require('path')
const rimraf = require('rimraf')

module.exports = function (fromPath) {
  const gitFolder = path.join(fromPath, '.git')
  return new Promise(function (resolve, reject) {
    rimraf(gitFolder, function (error) {
      if(error) {
        reject(error)
      }
      else {
        resolve(`removed ${gitFolder}`)
      }
    })
  })
}