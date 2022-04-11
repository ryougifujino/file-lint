import NameLintConfig from '@/nameLintConfig'

export { default as lintNames } from '@/nameLinter'
export { NC } from '@/nameValidators'
export const defineConfig = (config: NameLintConfig) => config
