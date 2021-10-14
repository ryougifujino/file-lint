import glob from '@/utils/glob'
import NameLintConfig, { NameRules } from '@/nameLintConfig'
import { isNameLegal } from '@/nameValidators'
import { validateNameLintConfig } from '@/validateNameLintConfig'

export interface NameLintMaterial {
  pathParts: PathParts
  pattern: string
  nameRules: NameRules
}

export interface NameLintMaterialsByPath {
  [path: string]: NameLintMaterial
}

interface PathParts {
  filename: string
  name: string
  extension: string
}

export function parsePath(path: string): PathParts {
  const beforeFilenameStart = path.lastIndexOf('/', path.length - 2)
  const filenameStart = beforeFilenameStart === -1 ? 0 : beforeFilenameStart + 1
  const filename = path.substring(filenameStart)
  let extension = ''
  if (filename.slice(-1) === '/') {
    extension = '/'
  } else {
    const extensionStart = filename.indexOf('.', 1)
    if (extensionStart !== -1) {
      extension = filename.substring(extensionStart)
    }
  }
  const name = filename.substr(0, filename.length - extension.length)

  return {
    filename,
    name,
    extension,
  }
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
  if (!validateNameLintConfig(nameLintConfig)) {
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
