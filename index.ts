#!/usr/bin/env node

/*
 * @adonisjs/cli
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { join } from 'path'
import { yellow, underline } from 'kleur'

import { Kernel, Manifest } from '@adonisjs/ace'
import { getCliVersion, getAdonisCoreVersion, dumpAsciiLogo } from './src/Services/helpers'

const kernel = new Kernel()

/**
 * Using manifest file over loading all commands all the
 * time
 */
const manifest = new Manifest(join(__dirname))
kernel.useManifest(manifest)

/**
 * Printing the help screen
 */
kernel.flag('help', (value, _options, command) => {
  if (!value) {
    return
  }

  dumpAsciiLogo()
  kernel.printHelp(command)
  process.exit(0)
}, {})

/**
 * Printing versions
 */
kernel.flag('version', (value) => {
  if (!value) {
    return
  }

  dumpAsciiLogo()
  console.log(`CLI version:       ${yellow(underline(getCliVersion() || 'NA'))}`)
  console.log(`Framework version: ${yellow(underline(getAdonisCoreVersion(process.cwd()) || 'NA'))}`)
  process.exit(0)
}, {})

/**
 * Invoking the command and handling errors
 */
kernel
  .handle(process.argv.slice(2))
  .catch((error) => {
    require('./src/Services/exceptionHandler').handleException(error)
    process.exit(1)
  })
