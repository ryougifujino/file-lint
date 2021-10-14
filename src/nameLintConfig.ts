import { NC } from '@/nameValidators'

export type NameRule = NC | RegExp

export type NameRules = NameRule | Array<NameRule>

export interface RulesByExtension {
  [extension: string]: NameRules
}

export interface RulesByPattern {
  [pattern: string]: RulesByExtension
}

export default interface NameLintConfig {
  rules: RulesByPattern
  overriding?: NameLintConfig
}
