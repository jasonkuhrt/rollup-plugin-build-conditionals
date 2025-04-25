import type * as Node from './node.js'

interface WalkContextSingular {
  type: `singular`
  get prop(): Node.Groups.Any
  set prop(value: Node.Groups.Any)
  parent: Node.Groups.Any
  propName: string
}

interface WalkContextArray {
  type: `array`
  get prop(): Node.Groups.Any[]
  set prop(value: Node.Groups.Any[])
  index: number
  parent: Node.Groups.Any
  propName: string
}

export const parse = (parameters: {
  parent: Node.Groups.Any | null
  propName: string | null | undefined | symbol | number
  index: null | undefined | number
}): WalkContextSingular | WalkContextArray | null => {
  const { parent, propName, index } = parameters

  if (!parent || propName === null || propName === undefined) return null

  // eslint-disable-next-line
  const value = (parent as any)[propName]

  if (Array.isArray(value)) {
    if (index === null || index === undefined) {
      throw new Error(`Array index must be provided`)
    }

    return {
      type: `array`,
      index,
      parent,
      propName: propName.toString(),
      get prop() {
        return value
      },
      set prop(value) {
        // eslint-disable-next-line
        ;(parent as any)[propName] = value
      },
    }
  }

  return {
    type: `singular`,
    parent,
    propName: propName.toString(),
    // eslint-disable-next-line
    get prop() {
      return value
    },
    // eslint-disable-next-line
    set prop(value) {
      // eslint-disable-next-line
      ;(parent as any)[propName] = value
    },
  }
}
