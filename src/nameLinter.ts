import glob from '@/utils/glob'
import NameLintConfig, { NameRules } from '@/models/nameLintConfig'
import PathParts from '@/models/pathParts'
import { isNameLegal, parsePath } from '@/utils/nameUtils'

interface NameLintMaterial {
  pathParts: PathParts
  pattern: string
  nameRules: NameRules
}

async function getNameLintMaterialsByPath(
  basePath: string,
  nameLintConfig: NameLintConfig,
): Promise<Map<string, NameLintMaterial> | null> {
  const { rules: rulesByPattern, overriding } = nameLintConfig
  const patterns = Object.keys(rulesByPattern)
  const pathsList = await Promise.all(patterns.map((pattern) => glob(basePath, pattern)))

  const nameLintMaterialsByPath = new Map<string, NameLintMaterial>()
  let pathsIdx = 0
  for (const pattern of patterns) {
    const paths = pathsList[pathsIdx++]
    const rulesByExtension = rulesByPattern[pattern]
    for (const path of paths) {
      const nameLintMaterial = nameLintMaterialsByPath.get(path)
      if (nameLintMaterial !== undefined) {
        console.log(`[ ${pattern} ] and [ ${nameLintMaterial.pattern} ] overlap at [ ${path} ].`)
        return null
      }
      const pathParts = parsePath(path)
      const nameRules = rulesByExtension[pathParts.extension]
      if (nameRules !== undefined) {
        nameLintMaterialsByPath.set(path, {
          pathParts,
          pattern,
          nameRules,
        })
      }
    }
  }

  if (overriding) {
    const overridingNameLintMaterialsByPath = await getNameLintMaterialsByPath(basePath, overriding)
    if (overridingNameLintMaterialsByPath === null) {
      return null
    }
    overridingNameLintMaterialsByPath.forEach((overridingNameLintMaterial, overridingPath) => {
      if (nameLintMaterialsByPath.get(overridingPath)) {
        nameLintMaterialsByPath.set(overridingPath, overridingNameLintMaterial)
      }
    })
  }

  return nameLintMaterialsByPath
}

export default async function lint(basePath: string, nameLintConfig: NameLintConfig): Promise<boolean> {
  // TODO: check nameLintConfig self
  const nameLintMaterialsByPath = await getNameLintMaterialsByPath(basePath, nameLintConfig)
  if (nameLintMaterialsByPath === null) {
    return false
  }
  for (const [, nameLintMaterial] of nameLintMaterialsByPath) {
    const {
      pattern,
      pathParts: { filename, name, extension },
      nameRules,
    } = nameLintMaterial
    if (!isNameLegal(name, nameRules)) {
      console.log(`[ ${name}(${filename}) ] does not match [ ${nameRules} ] at [ ${pattern}(${extension}) ]`)
      return false
    }
  }
  return true
}
