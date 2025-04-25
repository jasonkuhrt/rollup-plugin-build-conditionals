import { type Plugin, rollup } from 'rollup'
import { BuildMode } from '../src/entrypoints/index.js'

export const VirtualModules = (modules: Record<string, string>): Plugin => {
  return {
    name: `virtual-module`,
    resolveId(id) {
      return { id, moduleSideEffects: `no-treeshake` }
    },
    load(id) {
      return modules[id]
    },
  }
}

export type BuildParameters = BuildMode.Config & { code: string }

export const build = async (parameters: BuildParameters) => {
  const { code, ...config } = parameters
  const build = await rollup({
    input: `code`,
    plugins: [
      VirtualModules({ code }),
      BuildMode.create(config),
    ],
  })

  const { output } = await build.generate({})

  const chunk = output[0]

  return chunk.code
}
