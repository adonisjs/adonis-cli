/*
 * @adonisjs/cli
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { bgRed } from 'kleur'
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
      console.log(bgRed(error.message))
    }
    process.exit(1)
  })
