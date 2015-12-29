'use strict'

/**
 * adonis-cli
 * Copyright(c) 2015-2015 Harminder Virk
 * MIT Licensed
*/

const dotEnv = require('dotenv')
const fs = require('fs')
const path = require('path')
const uuid = require('node-uuid')

const readFile = function (file) {
  return new Promise(function (resolve, reject) {
    fs.readFile(file, function (error, contents) {
      if(error) {
        reject(error)
      } else {
        resolve(contents)
      }
    })
  })
}

const parseEnv = function (contents) {
  let config = dotEnv.parse(contents)
  config.APP_KEY = uuid.v4()
  let envContents = ''
  Object.keys(config).forEach(function (item) {
    envContents += `${item}=${config[item]}\n`
  })
  return envContents
}

const writeFile = function (toPath, contents) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(toPath, contents, function (error) {
      if(error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })
}

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
