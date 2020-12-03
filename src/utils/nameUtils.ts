import NC from '@/models/namingConvention'

const camelCase = /^[a-z][a-z0-9]*([A-Z][a-z0-9]*)*$/
const pascalCase = /^([A-Z][a-z0-9]*)+$/
const snakeCase = /^[a-z][a-z0-9]*(_[a-z0-9]+)*$/
const macroCase = /^[A-Z][A-Z0-9]*(_[A-Z0-9]+)*$/
const kebabCase = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/

export function ifMatchConvention(name: string, rule: RegExp): boolean {
  return rule.test(name)
}

export function isCamelCase(name: string): boolean {
  return ifMatchConvention(name, camelCase)
}

export function isPascalCase(name: string): boolean {
  return ifMatchConvention(name, pascalCase)
}

export function isSnakeCase(name: string): boolean {
  return ifMatchConvention(name, snakeCase)
}

export function isMacroCase(name: string): boolean {
  return ifMatchConvention(name, macroCase)
}

export function isKebabCase(name: string): boolean {
  return ifMatchConvention(name, kebabCase)
}

export function pruneSuffix(name: string, suffix?: string): string {
  const last = name.lastIndexOf(suffix || '.')
  return last === -1 ? name : name.substring(0, last)
}

export const makeSuffixRE = (() => {
  const searchValue = /\./g
  return (suffix: string): RegExp => {
    return new RegExp(`${suffix.replace(searchValue, '\\.')}$`)
  }
})()

export const getSuffixRE = (() => {
  const suffixReCache = new Map<string, RegExp>()
  return (suffix: string): RegExp => {
    let suffixRE = suffixReCache.get(suffix)
    if (suffixRE === undefined) {
      suffixReCache.set(suffix, (suffixRE = makeSuffixRE(suffix)))
    }
    return suffixRE
  }
})()

export function extractName(path: string, suffix: string): string {
  const pathLast = path.length - 1
  const slashPos = path.lastIndexOf('/', path[pathLast] === '/' ? pathLast - 1 : pathLast)
  const start = slashPos === -1 ? 0 : slashPos + 1
  return path.substring(start, path.length - suffix.length)
}

export type NameChecker = (name: string) => boolean

export const getNameChecker = (() => {
  const ncCheckerMap = new Map<NC, NameChecker>([
    [NC.CAMEL_CASE, isCamelCase],
    [NC.PASCAL_CASE, isPascalCase],
    [NC.SNAKE_CASE, isSnakeCase],
    [NC.MACRO_CASE, isMacroCase],
    [NC.KEBAB_CASE, isKebabCase],
  ])

  return (nc: NC) => {
    return ncCheckerMap.get(nc) as NameChecker
  }
})()
