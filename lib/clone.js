'use strict'

/**
 * adonis-cli
 * Copyright(c) 2015-2015 Harminder Virk
 * MIT Licensed
*/

const shell = require('shelljs')

/**
 * @description clones a repo with given branch to a defined
 * path
 * @method exports
 * @param  {String} repo
 * @param  {String} branch
 * @param  {String} toPath
 * @return {Object}
 * @public
 */
module.exports = function (repo, branch, toPath) {
  return new Promise(function (resolve, reject) {
    shell.exec(`git clone -b ${branch} --single-branch ${repo} ${toPath}`, function (error) {
      if (error) {
        reject(error)
      } else {
        resolve(`cloned repo to ${toPath}`)
      }
    })
  })
}
