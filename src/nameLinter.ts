import glob from '@/utils/glob'
import NameLintConfig, { NameRule, NameRules } from '@/models/nameLintConfig'
import PathParts from '@/models/pathParts'
import { isNameLegal, parsePath } from '@/utils/nameUtils'
import NC from '@/models/namingConvention'
import { isObject, safePrint } from '@/utils'

export const isNameRules = (() => {
  const ncValues = Object.values(NC)
  const isNameRule = (nameRule: NameRule) => {
    return nameRule instanceof RegExp || ncValues.includes(nameRule)
  }

  return (nameRules: NameRules) => {
    if (Array.isArray(nameRules)) {
      return nameRules.length > 0 && nameRules.every((nameRule) => isNameRule(nameRule))
    }
    return isNameRule(nameRules)
  }
})()

export function checkNameLintConfig(nameLintConfig: NameLintConfig): boolean {
  if (!isObject(nameLintConfig)) {
    console.log(`The nameLintConfig(${safePrint(nameLintConfig)}) should be an object.`)
    return false
  }
  const { rules: rulesByPattern, overriding } = nameLintConfig
  if (!isObject(rulesByPattern)) {
    console.log(`The rules(${safePrint(rulesByPattern)}) should be an object.`)
    return false
  }
  const patterns = Object.keys(rulesByPattern)
  for (const pattern of patterns) {
    const rulesByExtension = rulesByPattern[pattern]
    if (!isObject(rulesByExtension)) {
      console.log(`The rulesByExtension(${safePrint(rulesByExtension)}) should be an object.`)
      return false
    }
    const extensions = Object.keys(rulesByExtension)
    for (const extension of extensions) {
      const nameRules = rulesByExtension[extension]
      if (!isNameRules(nameRules)) {
        console.log(`The nameRule(s)(${safePrint(nameRules)}) should be a(an array(length >= 1) of) RegExp or NC`)
        return false
      }
    }
  }

  if (overriding !== undefined) {
    return checkNameLintConfig(overriding)
  }
  return true
}

export interface NameLintMaterial {
  pathParts: PathParts
  pattern: string
  nameRules: NameRules
}

export interface NameLintMaterialsByPath {
  [path: string]: NameLintMaterial
}

export async function getNameLintMaterialsByPath(
  basePath: string,
  nameLintConfig: NameLintConfig,
): Promise<NameLintMaterialsByPath | null> {
  const { rules: rulesByPattern, overriding } = nameLintConfig
  const patterns = Object.keys(rulesByPattern)
  const pathsList = await Promise.all(patterns.map((pattern) => glob(basePath, pattern)))

  const nameLintMaterialsByPath: NameLintMaterialsByPath = {}
  let pathsIdx = 0
  for (const pattern of patterns) {
    const paths = pathsList[pathsIdx++]
    const rulesByExtension = rulesByPattern[pattern]
    for (const path of paths) {
      const nameLintMaterial = nameLintMaterialsByPath[path]
      if (nameLintMaterial !== undefined) {
        console.log(`[ ${pattern} ] and [ ${nameLintMaterial.pattern} ] overlap at [ ${path} ].`)
        return null
      }
      const pathParts = parsePath(path)
      const nameRules = rulesByExtension[pathParts.extension]
      if (nameRules !== undefined) {
        nameLintMaterialsByPath[path] = {
          pathParts,
          pattern,
          nameRules,
        }
      }
    }
  }

  if (overriding) {
    const overridingNameLintMaterialsByPath = await getNameLintMaterialsByPath(basePath, overriding)
    if (overridingNameLintMaterialsByPath === null) {
      return null
    }

    for (const [overridingPath, overridingNameLintMaterial] of Object.entries(overridingNameLintMaterialsByPath)) {
      if (nameLintMaterialsByPath[overridingPath]) {
        nameLintMaterialsByPath[overridingPath] = overridingNameLintMaterial
      }
    }
  }

  return nameLintMaterialsByPath
}

export default async function lint(basePath: string, nameLintConfig: NameLintConfig): Promise<boolean> {
  if (!checkNameLintConfig(nameLintConfig)) {
    return false
  }
  const nameLintMaterialsByPath = await getNameLintMaterialsByPath(basePath, nameLintConfig)
  if (nameLintMaterialsByPath === null) {
    return false
  }
  let hasLintPassed = true
  for (const [path, nameLintMaterial] of Object.entries(nameLintMaterialsByPath)) {
    const {
      pattern,
      pathParts: { filename, name },
      nameRules,
    } = nameLintMaterial
    if (!isNameLegal(name, nameRules)) {
      console.log(`[ ${filename} ] does not match [ ${nameRules} ] at [ ${pattern} ] (path: ${path})`)
      hasLintPassed = false
    }
  }
  return hasLintPassed
}
