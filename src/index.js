#!/usr/bin/env node
'use strict'

/**
 * adonis-cli
 *
 * @license MIT
 * @copyright AdonisJs - Harminder Virk <virk@adonisjs.com>
*/

const path = require('path')
const Ace = require('adonis-ace')
const fold = require('adonis-fold')
const packageFile = path.join(__dirname, '../package.json')

fold.Registrar
  .register(['adonis-ace/providers/CommandProvider'])
  .then(() => {
    Ace.register([
      require('./Commands/New')
    ])
    Ace.invoke(require(packageFile))
  })
