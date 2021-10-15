import { highlight, printError } from '@/utils/print'
import NameLintConfig, { NameRule, NameRules } from '@/nameLintConfig'
import { isObject } from '@/utils/shared'
import { NC } from '@/nameValidators'

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

export function validateNameLintConfig(nameLintConfig: NameLintConfig): boolean {
  if (!isObject(nameLintConfig)) {
    printError(`The nameLintConfig ${highlight(nameLintConfig)} should be an object.`)
    return false
  }
  const { rules: rulesByPattern, overriding } = nameLintConfig
  if (!isObject(rulesByPattern)) {
    printError(`The rules ${highlight(rulesByPattern)} should be an object.`)
    return false
  }
  const patterns = Object.keys(rulesByPattern)
  for (const pattern of patterns) {
    const rulesByExtension = rulesByPattern[pattern]
    if (!isObject(rulesByExtension)) {
      printError(`The rulesByExtension ${highlight(rulesByExtension)} should be an object.`)
      return false
    }
    const extensions = Object.keys(rulesByExtension)
    for (const extension of extensions) {
      const nameRules = rulesByExtension[extension]
      if (!isNameRules(nameRules)) {
        printError(
          `The nameRule/nameRules ${highlight(
            nameRules,
          )} should be a RegExp or NC/an array(length >= 1) of RegExp or NC.`,
        )
        return false
      }
    }
  }

  if (overriding !== undefined) {
    return validateNameLintConfig(overriding)
  }
  return true
}
