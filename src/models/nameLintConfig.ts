import NC from '@/models/namingConvention'

export type NameRule = NC | RegExp

export type NameRules = NameRule | Array<NameRule>

export interface RulesByExtension {
  [extension: string]: NameRules
}

export interface RulesByPattern {
  [pattern: string]: RulesByExtension
}

interface NameLintConfig {
  rules: RulesByPattern
  overriding?: NameLintConfig
}

export default NameLintConfig
