/*
* @adonisjs/cli
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import { RcFile } from '@ioc:Adonis/Core/Application'
import * as tsStatic from 'typescript'

/**
 * Converts Ioc container import statements to `use` statements
 * in compiled Javascript code.
 */
export function iocTransformer (ts: typeof tsStatic, rcFile: RcFile) {
  const autoloads = Object.keys(rcFile.autoloads)

  return (ctx: tsStatic.TransformationContext) => {
    return (sourceFile: tsStatic.SourceFile) => {
      function visitor (node: tsStatic.Node): tsStatic.Node {
        if (
          ts.isCallExpression(node)
          && node.expression
          && ts.isIdentifier(node.expression)
          && node.expression.escapedText === 'require'
        ) {
          const moduleName = (node.arguments[0] as tsStatic.StringLiteral).text
          if (moduleName && moduleName.startsWith('@ioc:')) {
            return ts.createCall(ts.createIdentifier(
              `global[Symbol.for('ioc.useEsm')]`),
              undefined,
              [ts.createStringLiteral(moduleName.substr(5))],
            )
          }

          if (moduleName && autoloads.find((autoload) => moduleName.startsWith(`${autoload}/`))) {
            return ts.createCall(ts.createIdentifier(
              `global[Symbol.for('ioc.use')]`),
              undefined,
              [ts.createStringLiteral(moduleName)],
            )
          }
        }
        return ts.visitEachChild(node, visitor, ctx)
      }

      return ts.visitEachChild(sourceFile, visitor, ctx)
    }
  }
}
