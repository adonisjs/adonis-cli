#!/usr/bin/env node

/*
 * @adonisjs/cli
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { red, cyan } from 'kleur'
import { join } from 'path'
import { Kernel, Manifest } from '@adonisjs/ace'

const kernel = new Kernel()
const manifest = new Manifest(join(__dirname))
kernel.useManifest(manifest)

kernel.flag('help', (value, _options, command) => {
  if (!value) {
    return
  }

  kernel.printHelp(command)
  process.exit(0)
}, {})

kernel
  .handle(process.argv.slice(2))
  .catch((error) => {
    if (error.name === 'InvalidArgumentException') {
      console.log(`${red('✖ error')}  ${error.message.replace(/{(.[^}]*)}/g, (_match, group) => {
        return cyan(group)
      })}`)
    } else {
      console.log(`${red('✖ error')}   Programmatic error`)
      console.log(red(error.stack))
    }
    process.exit(1)
  })
