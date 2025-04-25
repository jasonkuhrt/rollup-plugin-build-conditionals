import * as Astring from 'astring'
import type { Plugin } from 'rollup'
import type { BuildMode } from './lib/build-mode.js'
import { buildModes } from './lib/build-mode.js'
import { Estree } from './lib/estree/index.js'

export interface Config {
  mode: BuildMode
}

export const create = (config: Config): Plugin => ({
  name: `build-conditionals`,
  transform(code, _id) {
    let isCodeChanged = false as boolean

    const ast = this.parse(code)

    Estree.Walker.walk(ast, {
      enter(node, parent, prop, index) {
        if (!Estree.Node.isIfStatement(node)) return

        const buildMode = getBuildMode(node.test)
        if (!buildMode) return

        if (Estree.Node.isIfStatement(node.alternate)) {
          throw new Error(`Build Mode: Use multiple if blocks instead of else-if chains.`)
        }

        isCodeChanged = true

        // Strip/inline the if-statement and the alternate (if any)
        // respecting the build mode comparison.

        const context = Estree.Walker.Context.parse({ parent, propName: prop, index })
        if (!context) throw new Error(`Build Mode: Could not parse node context`)

        const isTestPass = strictEqualCompare(buildMode.isNotComparison, buildMode.mode, config.mode)

        const nodeAlternate = Estree.Node.isBlockStatement(node.alternate)
          ? node.alternate.body
          : node.alternate
          ? [node.alternate]
          : []

        const nodeConsequent = Estree.Node.isBlockStatement(node.consequent)
          ? node.consequent.body
          : [node.consequent]

        if (context.type === `array`) {
          context.prop.splice(context.index, 1, ...(isTestPass ? nodeConsequent : nodeAlternate))
        } else {
          // TODO: find a test case where context is NOT an array
          throw new Error(`TODO: record this case as a test to understand when this happens.`)
          // const newProp = isTestPass ? node.consequent : nodeAlternate[0] ?? null
          // if (newProp) {
          //   context.prop = newProp
          // }
        }

        // Skip processing the replaced node
        this.skip()
      },
    })

    if (!isCodeChanged) {
      return {
        ast,
        code,
        map: null,
      }
    }

    // todo: source map transformation ???
    // https://rollupjs.org/plugin-development/#source-code-transformations

    return {
      ast,
      code: Astring.generate(ast),
      map: { mappings: `` },
    }
  },
})

const getBuildMode = (
  node: Estree.Node.BaseNode,
  isNotComparison?: boolean,
): null | { isNotComparison: boolean; mode: BuildMode } => {
  // Handle e.g.: if (!foo)
  if (Estree.Node.isUnaryExpression(node)) {
    if (node.operator !== `!`) return null
    return (getBuildMode(node.argument, true))
  }

  if (!Estree.Node.isIdentifier(node)) return null
  if (!buildModes.includes(node.name as any)) return null

  return {
    isNotComparison: isNotComparison ?? false,
    mode: node.name as BuildMode,
  }
}

const strictEqualCompare = (isNotComparison: boolean, value1: unknown, value2: unknown) => {
  return isNotComparison ? value1 !== value2 : value1 === value2
}
