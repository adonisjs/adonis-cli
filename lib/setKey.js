'use strict'

/**
 * adonis-cli
 * Copyright(c) 2015-2015 Harminder Virk
 * MIT Licensed
*/

const dotEnv = require('dotenv')
const fs = require('fs')
const path = require('path')
const randomstring = require('randomstring')

/**
 * @description reads a given file and returns it's
 * contents as a promise
 * @method readFile
 * @param  {String} file
 * @return {Object}
 * @public
 */
const readFile = function (file) {
  return new Promise(function (resolve, reject) {
    fs.readFile(file, function (error, contents) {
      if (error) {
        reject(error)
      } else {
        resolve(contents)
      }
    })
  })
}

/**
 * @description parses the .env.example file contents
 * and returns a string with APP_KEY to be used
 * for creating .env file
 * @method parseEnv
 * @param  {Buffer} contents
 * @return {String}
 * @public
 */
const parseEnv = function (contents) {
  let config = dotEnv.parse(contents)
  let envContents = ''
  config.APP_KEY = randomstring.generate({
    readable: true
  })
  Object.keys(config).forEach(function (item) {
    envContents += `${item}=${config[item]}\n`
  })
  return envContents
}

/**
 * @description writes a file back to disc with file contents
 * @method writeFile
 * @param  {String}  toPath
 * @param  {String}  contents
 * @return {Object}
 * @public
 */
const writeFile = function (toPath, contents) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(toPath, contents, function (error) {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })
}

/**
 * @description creates a .env file inside the project root
 * and sets APP_KEY to a random 32 characters long string
 * @method exports
 * @param  {String} toPath
 * @return {Object}
 * @public
 */
module.exports = function (toPath) {
  const envExample = path.join(toPath, '.env.example')

  return new Promise(function (resolve, reject) {
    readFile(envExample)
      .then(function (contents) {
        const envContents = parseEnv(contents)
        const envPath = path.join(toPath, '.env')
        return writeFile(envPath, envContents)
      })
      .then(resolve)
      .catch(reject)
  })
}
