const camelCase = /^[a-z][a-z0-9]*([A-Z][a-z0-9]*)*$/
const pascalCase = /^([A-Z][a-z0-9]*)*$/
const snakeCase = /^[a-z][a-z0-9]*(_[a-z0-9]+)*$/
const macroCase = /^[A-Z][A-Z0-9]*(_[A-Z0-9]+)*$/
const kebabCase = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/

export function pruneExtension(name: string, extension?: string): string {
  const last = name.lastIndexOf(extension || '.')
  return last === -1 ? name : name.substring(0, last)
}

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
