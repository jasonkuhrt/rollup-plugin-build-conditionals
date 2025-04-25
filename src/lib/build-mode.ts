export const BuildModeEnum = {
  buildDevelopment: `BUILD_DEVELOPMENT`,
  buildProduction: `BUILD_PRODUCTION`,
} as const

export type BuildMode = typeof BuildModeEnum[keyof typeof BuildModeEnum]

export const buildModes = Object.values(BuildModeEnum)
