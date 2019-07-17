/*
 * @adonisjs/cli
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { Kernel, Manifest } from '@adonisjs/ace'
import { join } from 'path'

const kernel = new Kernel()
const manifest = new Manifest(join(__dirname))
kernel.useManifest(manifest)
kernel.handle(process.argv.slice(2))
