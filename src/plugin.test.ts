import { expect, test } from 'vitest'
import { build, type BuildParameters } from '../tests/helpers.js'

type TestCase = BuildParameters & {
  result: string
}

// todo: support for switch statements
// todo: support for else-if chains

test.for<TestCase>(
  // dprint-ignore
  [
    // Syntax Tests

    { mode: `BUILD_DEVELOPMENT`, code: `if (BUILD_DEVELOPMENT ) 1`, result: `;1;\n` },
    { mode: `BUILD_DEVELOPMENT`, code: `if (BUILD_DEVELOPMENT ) 1; else 2`, result: `;1;\n` },
    { mode: `BUILD_DEVELOPMENT`, code: `if (!BUILD_DEVELOPMENT ) 1; else 2`, result: `;2;\n` },

    // Logical Tests

    { mode: `BUILD_DEVELOPMENT`, code: `if (BUILD_DEVELOPMENT ) { 1 }`, result: `;1;\n` },
    { mode: `BUILD_PRODUCTION` , code: `if (!BUILD_DEVELOPMENT) { 1 }`, result: `;1;\n` },
    { mode: `BUILD_PRODUCTION` , code: `if (BUILD_DEVELOPMENT ) { 1 }`, result: `\n` },
    { mode: `BUILD_DEVELOPMENT`, code: `if (!BUILD_DEVELOPMENT) { 1 }`, result: `\n` },

    { mode: `BUILD_DEVELOPMENT`, code: `if (BUILD_DEVELOPMENT) { 1 } else { 2 }`, result: `;1;\n` },
    { mode: `BUILD_DEVELOPMENT`, code: `if (!BUILD_PRODUCTION) { 1 } else { 2 }`, result: `;1;\n` },
    { mode: `BUILD_PRODUCTION` , code: `if (BUILD_DEVELOPMENT) { 1 } else { 2 }`, result: `;2;\n` },
    { mode: `BUILD_PRODUCTION` , code: `if (!BUILD_PRODUCTION) { 1 } else { 2 }`, result: `;2;\n` },
  ],
)(`%j`, async ({ result, ...config }) => {
  const actual = await build(config)
  expect(actual).toEqual(result)
})
