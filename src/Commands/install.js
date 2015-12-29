'use strict'

/**
 * adonis-cli
 * Copyright(c) 2015-2015 Harminder Virk
 * MIT Licensed
*/

const shell = require('shelljs')
// const clear = process.platform === 'win32' ? 'cls' : 'clear'

module.exports = function (insidePath) {
  return new Promise(function (resolve, reject) {
    shell.exec(`cd ${insidePath} && npm install`, function (error) {
      if(error) {
        reject(error)
      } else {
        resolve(`installed dependencies inside ${insidePath}`)
      }
    })
  })
}