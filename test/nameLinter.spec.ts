/* eslint-disable @typescript-eslint/ban-ts-comment */
import NC from '@/models/namingConvention'
import { checkNameLintConfig, isNameRules } from '@/nameLinter'

test('isNameRules', () => {
  expect(isNameRules(/Foo/)).toBe(true)
  expect(isNameRules(NC.CAMEL_CASE)).toBe(true)

  const falseNameRuleCases = [123, true, null, undefined, {}, () => 0, Symbol('symbol')]

  falseNameRuleCases.forEach((falseNameRule) => {
    // @ts-ignore
    expect(isNameRules(falseNameRule)).toBe(false)
  })

  expect(isNameRules([])).toBe(false)
  falseNameRuleCases.forEach((falseNameRule) => {
    // @ts-ignore
    expect(isNameRules([falseNameRule])).toBe(false)
    // @ts-ignore
    expect(isNameRules([falseNameRule, /Foo/])).toBe(false)
    // @ts-ignore
    expect(isNameRules([falseNameRule, NC.CAMEL_CASE])).toBe(false)
  })

  expect(isNameRules([/Foo/])).toBe(true)
  expect(isNameRules([NC.CAMEL_CASE])).toBe(true)
  expect(isNameRules([/Foo/, NC.CAMEL_CASE])).toBe(true)
})

describe('checkNameLintConfig', () => {
  const nonObjValueCases = [123, '', true, null, undefined, [], () => 0, Symbol('symbol')]

  test('test the false types of nameLintConfig', () => {
    // @ts-ignore
    expect(checkNameLintConfig({})).toBe(false)
    nonObjValueCases.forEach((nonObjValue) => {
      // @ts-ignore
      expect(checkNameLintConfig(nonObjValue)).toBe(false)
    })
  })

  test('test the false types of rulesByPattern(rules)', () => {
    // @ts-ignore
    nonObjValueCases.forEach((nonObjValue) => {
      expect(
        checkNameLintConfig({
          // @ts-ignore
          rules: nonObjValue,
        }),
      ).toBe(false)
    })
  })

  test('test the false types of rulesByExtension', () => {
    nonObjValueCases.forEach((nonObjValue) => {
      expect(
        checkNameLintConfig({
          rules: {
            // @ts-ignore
            'src/pattern/**': nonObjValue,
          },
        }),
      ).toBe(false)
    })
  })

  test('test the false types of nameRules', () => {
    const nameRuleOfFalseTypeCases = [123, '', true, null, undefined, {}, () => 0, Symbol('symbol')]

    nameRuleOfFalseTypeCases.forEach((nameRuleOfFalseType) => {
      expect(
        checkNameLintConfig({
          rules: {
            'src/pattern/**': {
              // @ts-ignore
              '.ts': nameRuleOfFalseType,
            },
          },
        }),
      ).toBe(false)
      expect(
        checkNameLintConfig({
          rules: {
            'src/pattern/**': {
              // @ts-ignore
              '.ts': [nameRuleOfFalseType],
            },
          },
        }),
      ).toBe(false)
    })
    expect(
      checkNameLintConfig({
        rules: {
          'src/pattern/**': {
            '.ts': [],
          },
        },
      }),
    ).toBe(false)
  })

  test('test the false types of overriding', () => {
    nonObjValueCases
      .filter((value) => value !== undefined)
      .forEach((nonObjUndefValue) => {
        expect(
          checkNameLintConfig({
            rules: {},
            // @ts-ignore
            overriding: nonObjUndefValue,
          }),
        ).toBe(false)
      })
  })

  test('test the true structures of nameLintConfig', () => {
    expect(
      checkNameLintConfig({
        rules: {},
      }),
    ).toBe(true)
    expect(
      checkNameLintConfig({
        rules: {
          'src/pattern/**': {},
        },
      }),
    ).toBe(true)
    expect(
      checkNameLintConfig({
        rules: {
          'src/pattern/**': {
            '.ts': NC.CAMEL_CASE,
          },
        },
      }),
    ).toBe(true)
    expect(
      checkNameLintConfig({
        rules: {
          'src/pattern/**': {
            '.ts': NC.CAMEL_CASE,
          },
        },
        overriding: {
          rules: {},
        },
      }),
    ).toBe(true)
    expect(
      checkNameLintConfig({
        rules: {
          'src/pattern/**': {
            '.ts': NC.CAMEL_CASE,
            '.d.ts': [NC.CAMEL_CASE, /RegExp/],
          },
          'src/fun-facts/**': {},
        },
        overriding: {
          rules: {},
        },
      }),
    ).toBe(true)
  })
})
