import glob from '@/utils/glob'
import { highlight, printError, toPrintable } from '@/utils/print'
import NameLintConfig, { NameRules } from '@/nameLintConfig'
import { isNameLegal } from '@/nameValidators'
import { validateNameLintConfig } from '@/validateNameLintConfig'

export interface NameLintFuel {
  pattern: string
  extension: string
  nameRules: NameRules
  name: string
  filename: string
}

export interface NameLintFuelsByPath {
  [path: string]: NameLintFuel
}

interface NameExtension {
  name: string
  extension: string
}

export interface SmartFilename {
  filename: string
  nameExtensionCandidates: Array<NameExtension>
}

export function parsePath(path: string): SmartFilename {
  const beforeFilenameStart = path.lastIndexOf('/', path.length - 2)
  const filenameStart = beforeFilenameStart === -1 ? 0 : beforeFilenameStart + 1
  const filename = path.substring(filenameStart)

  const nameExtensionCandidates: Array<NameExtension> = []
  if (filename.slice(-1) === '/') {
    const extension = '/'
    nameExtensionCandidates.push({
      name: filename.substr(0, filename.length - extension.length),
      extension,
    })
  } else {
    let extensionStart = filename.indexOf('.', 1)
    if (extensionStart !== -1) {
      while (extensionStart !== -1) {
        const extension = filename.substring(extensionStart)
        nameExtensionCandidates.push({
          name: filename.substr(0, filename.length - extension.length),
          extension,
        })
        extensionStart = filename.indexOf('.', extensionStart + 1)
      }
    } else {
      nameExtensionCandidates.push({
        name: filename,
        extension: '',
      })
    }
  }

  return {
    filename,
    nameExtensionCandidates,
  }
}

export async function getNameLintFuelsByPath(
  basePath: string,
  nameLintConfig: NameLintConfig,
): Promise<NameLintFuelsByPath | null> {
  const { rules: rulesByPattern, overriding } = nameLintConfig
  const patterns = Object.keys(rulesByPattern)
  const pathsList = await Promise.all(patterns.map((pattern) => glob(basePath, pattern)))

  const nameLintFuelsByPath: NameLintFuelsByPath = {}
  let pathsIdx = 0
  for (const pattern of patterns) {
    const paths = pathsList[pathsIdx++]
    const rulesByExtension = rulesByPattern[pattern]
    for (const path of paths) {
      const nameLintFuel = nameLintFuelsByPath[path]
      if (nameLintFuel !== undefined) {
        printError(`${highlight(pattern)} and ${highlight(nameLintFuel.pattern)} overlap at ${highlight(path)}.`)
        return null
      }
      const smartFilename = parsePath(path)
      for (const { name, extension } of smartFilename.nameExtensionCandidates) {
        const nameRules = rulesByExtension[extension]
        if (nameRules !== undefined) {
          nameLintFuelsByPath[path] = {
            pattern,
            extension,
            nameRules,
            name,
            filename: smartFilename.filename,
          }
          break
        }
      }
    }
  }

  if (overriding) {
    const overridingNameLintFuelsByPath = await getNameLintFuelsByPath(basePath, overriding)
    if (overridingNameLintFuelsByPath === null) {
      return null
    }

    for (const [overridingPath, overridingNameLintFuel] of Object.entries(overridingNameLintFuelsByPath)) {
      const nameLintFuel = nameLintFuelsByPath[overridingPath]
      if (nameLintFuel && nameLintFuel.extension === overridingNameLintFuel.extension) {
        nameLintFuelsByPath[overridingPath] = overridingNameLintFuel
      }
    }
  }

  return nameLintFuelsByPath
}

export default async function lintNames(basePath: string, nameLintConfig: NameLintConfig): Promise<boolean> {
  if (!validateNameLintConfig(nameLintConfig)) {
    return false
  }
  const nameLintFuelsByPath = await getNameLintFuelsByPath(basePath, nameLintConfig)
  if (nameLintFuelsByPath === null) {
    return false
  }
  let hasLintPassed = true
  for (const [path, nameLintFuel] of Object.entries(nameLintFuelsByPath)) {
    const { pattern, extension, nameRules, name, filename } = nameLintFuel
    if (!isNameLegal(name, nameRules)) {
      printError(
        `${highlight(filename)} does not match ${highlight(`${extension}: ${toPrintable(nameRules)}`)} at ${highlight(
          pattern,
        )} (path: ${path}).`,
      )
      hasLintPassed = false
    }
  }
  return hasLintPassed
}
