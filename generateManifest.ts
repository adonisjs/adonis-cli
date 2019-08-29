/*
 * @adonisjs/cli
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

import { join } from 'path'
import { Manifest } from '@adonisjs/ace'

const manifest = new Manifest(join(__dirname))
manifest.generate(
  [
    'src/Commands/Serve',
    'src/Commands/Build',
    'src/Commands/New',
    'src/Commands/RunInstructions',
    'src/Commands/Make/Controller',
  ],
)
