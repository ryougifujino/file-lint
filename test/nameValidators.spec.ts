import {
  getNameNameValidator,
  isCamelCase,
  isKebabCase,
  isMacroCase,
  isNameLegal,
  isPascalCase,
  isSnakeCase,
  matchesConvention,
  NC,
} from '@/nameValidators'

const camelCaseName = 'camelCase'
const pascalCaseName = 'PascalCase'
const snakeCaseName = 'snake_case'
const macroCaseName = 'MACRO_CASE'
const kebabCaseName = 'kebab-case'

test('isCamelCase', () => {
  expect(isCamelCase(camelCaseName)).toBe(true)
  expect(isCamelCase(pascalCaseName)).toBe(false)
  expect(isCamelCase(snakeCaseName)).toBe(false)
  expect(isCamelCase(macroCaseName)).toBe(false)
  expect(isCamelCase(kebabCaseName)).toBe(false)
  expect(isCamelCase('camelcase')).toBe(true)
  expect(isCamelCase('cAMELCASE')).toBe(true)
  expect(isCamelCase('caMElcASe')).toBe(true)
  expect(isCamelCase('camelCase233')).toBe(true)
  expect(isCamelCase('camel233case')).toBe(true)
  expect(isCamelCase('camel233Case')).toBe(true)
  expect(isCamelCase('233camelCase')).toBe(false)
  expect(isCamelCase('')).toBe(false)
})

test('isPascalCase', () => {
  expect(isPascalCase(camelCaseName)).toBe(false)
  expect(isPascalCase(pascalCaseName)).toBe(true)
  expect(isPascalCase(snakeCaseName)).toBe(false)
  expect(isPascalCase(macroCaseName)).toBe(false)
  expect(isPascalCase(kebabCaseName)).toBe(false)
  expect(isPascalCase('PASCALCASE')).toBe(true)
  expect(isPascalCase('Pascalcase')).toBe(true)
  expect(isPascalCase('PaSCalCAse')).toBe(true)
  expect(isPascalCase('PascalCase233')).toBe(true)
  expect(isPascalCase('Pascal233case')).toBe(true)
  expect(isPascalCase('Pascal233Case')).toBe(true)
  expect(isPascalCase('233PascalCase')).toBe(false)
  expect(isPascalCase('')).toBe(false)
})

test('isSnakeCase', () => {
  expect(isSnakeCase(camelCaseName)).toBe(false)
  expect(isSnakeCase(pascalCaseName)).toBe(false)
  expect(isSnakeCase(snakeCaseName)).toBe(true)
  expect(isSnakeCase(macroCaseName)).toBe(false)
  expect(isSnakeCase(kebabCaseName)).toBe(false)
  expect(isSnakeCase('snakecase')).toBe(true)
  expect(isSnakeCase('snake__case')).toBe(false)
  expect(isSnakeCase('_snake_case')).toBe(false)
  expect(isSnakeCase('snake_case_')).toBe(false)
  expect(isSnakeCase('snake_case_233')).toBe(true)
  expect(isSnakeCase('snake_case233')).toBe(true)
  expect(isSnakeCase('snake_233_case')).toBe(true)
  expect(isSnakeCase('snake233_case')).toBe(true)
  expect(isSnakeCase('233_snake_case')).toBe(false)
  expect(isSnakeCase('')).toBe(false)
})

test('isMacroCase', () => {
  expect(isMacroCase(camelCaseName)).toBe(false)
  expect(isMacroCase(pascalCaseName)).toBe(false)
  expect(isMacroCase(snakeCaseName)).toBe(false)
  expect(isMacroCase(macroCaseName)).toBe(true)
  expect(isMacroCase(kebabCaseName)).toBe(false)
  expect(isMacroCase('MACROCASE')).toBe(true)
  expect(isMacroCase('MACRO__CASE')).toBe(false)
  expect(isMacroCase('_MACRO_CASE')).toBe(false)
  expect(isMacroCase('MACRO_CASE_')).toBe(false)
  expect(isMacroCase('MACRO_CASE_233')).toBe(true)
  expect(isMacroCase('MACRO_CASE233')).toBe(true)
  expect(isMacroCase('MACRO_233_CASE')).toBe(true)
  expect(isMacroCase('MACRO233_CASE')).toBe(true)
  expect(isMacroCase('233_MACRO_CASE')).toBe(false)
  expect(isMacroCase('')).toBe(false)
})

test('isKebabCase', () => {
  expect(isKebabCase(camelCaseName)).toBe(false)
  expect(isKebabCase(pascalCaseName)).toBe(false)
  expect(isKebabCase(snakeCaseName)).toBe(false)
  expect(isKebabCase(macroCaseName)).toBe(false)
  expect(isKebabCase(kebabCaseName)).toBe(true)
  expect(isKebabCase('kebabcase')).toBe(true)
  expect(isKebabCase('kebab--case')).toBe(false)
  expect(isKebabCase('-kebab-case')).toBe(false)
  expect(isKebabCase('kebab-case-')).toBe(false)
  expect(isKebabCase('kebab-case-233')).toBe(true)
  expect(isKebabCase('kebab-case233')).toBe(true)
  expect(isKebabCase('kebab-233-case')).toBe(true)
  expect(isKebabCase('kebab233-case')).toBe(true)
  expect(isKebabCase('233-kebab-case')).toBe(false)
  expect(isKebabCase('')).toBe(false)
})

test('matchesConvention', () => {
  expect(matchesConvention('VName', /^V[A-Z][a-z]*$/)).toBe(true)
  expect(matchesConvention('VName', /^[a-z]*$/)).toBe(false)
})

test('getNameNameValidator', () => {
  expect(getNameNameValidator(NC.CAMEL_CASE)).toBe(isCamelCase)
  expect(getNameNameValidator(NC.PASCAL_CASE)).toBe(isPascalCase)
  expect(getNameNameValidator(NC.MACRO_CASE)).toBe(isMacroCase)
  expect(getNameNameValidator(NC.KEBAB_CASE)).toBe(isKebabCase)
  expect(getNameNameValidator(NC.SNAKE_CASE)).toBe(isSnakeCase)
})

test('isNameLegal', () => {
  expect(isNameLegal('camelCase', NC.CAMEL_CASE)).toBe(true)
  expect(isNameLegal('PascalCase', NC.CAMEL_CASE)).toBe(false)
  expect(isNameLegal('foo233bar', /^foo\d+bar$/)).toBe(true)
  expect(isNameLegal('foobar', /^foo\d+bar$/)).toBe(false)
  expect(isNameLegal('camelCase', [NC.CAMEL_CASE, /^foo\d+bar$/])).toBe(true)
  expect(isNameLegal('foo233bar', [NC.CAMEL_CASE, /^foo\d+bar$/])).toBe(true)
  expect(isNameLegal('PascalCase', [NC.CAMEL_CASE, /^foo\d+bar$/])).toBe(false)
})
