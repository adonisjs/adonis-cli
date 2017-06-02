'use strict'

/**
 * adonis-cli
 * @license MIT
 * @copyright Adonis - Harminder Virk <virk@adonisjs.com>
*/

const expect = require('chai').expect
const exec = require('child_process').exec
const fs = require('fs-extra')
const path = require('path')
const pify = require('pify')

const script = path.join(__dirname, '../../src/index.js')
const projectDir = path.join(process.cwd(), 'yardstick')
const asyncTimeoutMilis = 1 * 60 * 1000 // 1 minutes

describe('`adonis new` command', function () {
  this.timeout(asyncTimeoutMilis)

  afterEach(function (done) {
    fs.exists(projectDir, exists => {
      if (exists) {
        fs.remove(projectDir, done)
      }
    })
  })
  context('when invoked with `--yarn` flag', function () {
    it('should create project and install dependencies with yarn', function (done) {
      let command = `node ${script} new yardstick --yarn`

      pify(exec)(command).then(() => {
        let yarnLockFile = path.join(projectDir, 'yarn.lock')
        expect(fs.existsSync(yarnLockFile)).to.equal(true)
        done()
      }).catch(error => {
        done(error)
      })
    })
  })
  context('when invoked with `--npm` flag', function () {
    it('should create project and install dependencies with npm', function (done) {
      let command = `node ${script} new yardstick --npm`

      pify(exec)(command).then(() => {
        let nodeModulesDir = path.join(projectDir, 'node_modules')
        expect(fs.existsSync(nodeModulesDir)).to.equal(true)
        done()
      }).catch(error => {
        done(error)
      })
    })
  })
})
