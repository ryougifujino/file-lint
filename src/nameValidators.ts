import { NameRule, NameRules } from '@/nameLintConfig'

const camelCase = /^[a-z][a-z0-9]*([A-Z][a-z0-9]*)*$/
const pascalCase = /^([A-Z][a-z0-9]*)+$/
const snakeCase = /^[a-z][a-z0-9]*(_[a-z0-9]+)*$/
const macroCase = /^[A-Z][A-Z0-9]*(_[A-Z0-9]+)*$/
const kebabCase = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/

export enum NC {
  CAMEL_CASE = 'camelCase',
  PASCAL_CASE = 'PascalCase',
  SNAKE_CASE = 'snake_case',
  MACRO_CASE = 'MACRO_CASE',
  KEBAB_CASE = 'kebab-case',
}

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

export type NameValidator = (name: string) => boolean

export const getNameNameValidator = (() => {
  const validatorsByNC = new Map<NC, NameValidator>([
    [NC.CAMEL_CASE, isCamelCase],
    [NC.PASCAL_CASE, isPascalCase],
    [NC.SNAKE_CASE, isSnakeCase],
    [NC.MACRO_CASE, isMacroCase],
    [NC.KEBAB_CASE, isKebabCase],
  ])

  return (nc: NC) => {
    return validatorsByNC.get(nc) as NameValidator
  }
})()

export const isNameLegal = (() => {
  const matchesNameRule = (name: string, nameRule: NameRule) => {
    if (nameRule instanceof RegExp) {
      return nameRule.test(name)
    }
    return getNameNameValidator(nameRule)(name)
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
