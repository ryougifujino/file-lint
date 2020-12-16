import NC from '@/models/namingConvention'
import PathParts from '@/models/pathParts'
import { NameRule, NameRules } from '@/models/nameLintConfig'

const camelCase = /^[a-z][a-z0-9]*([A-Z][a-z0-9]*)*$/
const pascalCase = /^([A-Z][a-z0-9]*)+$/
const snakeCase = /^[a-z][a-z0-9]*(_[a-z0-9]+)*$/
const macroCase = /^[A-Z][A-Z0-9]*(_[A-Z0-9]+)*$/
const kebabCase = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/

export function matchesConvention(name: string, rule: RegExp): boolean {
  return rule.test(name)
}

export function isCamelCase(name: string): boolean {
  return matchesConvention(name, camelCase)
}

export function isPascalCase(name: string): boolean {
  return matchesConvention(name, pascalCase)
}

export function isSnakeCase(name: string): boolean {
  return matchesConvention(name, snakeCase)
}

export function isMacroCase(name: string): boolean {
  return matchesConvention(name, macroCase)
}

export function isKebabCase(name: string): boolean {
  return matchesConvention(name, kebabCase)
}

export type NameChecker = (name: string) => boolean

export const getNameChecker = (() => {
  const checkersByNc = new Map<NC, NameChecker>([
    [NC.CAMEL_CASE, isCamelCase],
    [NC.PASCAL_CASE, isPascalCase],
    [NC.SNAKE_CASE, isSnakeCase],
    [NC.MACRO_CASE, isMacroCase],
    [NC.KEBAB_CASE, isKebabCase],
  ])

  return (nc: NC) => {
    return checkersByNc.get(nc) as NameChecker
  }
})()

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

export const isNameLegal = (() => {
  const matchesNameRule = (name: string, nameRule: NameRule) => {
    if (nameRule instanceof RegExp) {
      return nameRule.test(name)
    }
    return getNameChecker(nameRule)(name)
  }

  return (name: string, nameRules: NameRules): boolean => {
    if (Array.isArray(nameRules)) {
      for (const nameRule of nameRules) {
        if (matchesNameRule(name, nameRule)) {
          return true
        }
      }
      return false
    }
    return matchesNameRule(name, nameRules)
  }
})()
