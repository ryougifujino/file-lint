/* eslint-disable @typescript-eslint/ban-ts-comment */
import NC from '@/models/namingConvention'
import lint, {
  checkNameLintConfig,
  isNameRules,
  getNameLintMaterialsByPath,
  NameLintMaterialsByPath,
} from '@/nameLinter'
import { resolve } from 'path'

const resolveTestFileTree = (relativePath: string) => resolve(__dirname, 'file-tree-cases', relativePath)
const case1BasePath = resolveTestFileTree('case1')
const case2BasePath = resolveTestFileTree('case2')

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

describe('getNameLintMaterialsByPath', () => {
  test('rules overlap', async () => {
    expect(
      await getNameLintMaterialsByPath(case1BasePath, {
        rules: {
          'src/components/**': {
            '.tsx': NC.PASCAL_CASE,
          },
          'src/**/components/**': {
            '.tsx': NC.PASCAL_CASE,
          },
        },
      }),
    ).toBe(null)
  })

  test('rules does not overlap(without overriding rules)', async () => {
    expect(
      await getNameLintMaterialsByPath(case1BasePath, {
        rules: {
          'src/components/**': {
            '.tsx': NC.PASCAL_CASE,
          },
          'src/pages/user/login/components/**': {
            '.tsx': NC.PASCAL_CASE,
          },
          '*': {
            '.js': NC.SNAKE_CASE,
          },
        },
      }),
    ).toStrictEqual({
      'src/components/List/CircleLoading.tsx': {
        pathParts: {
          filename: 'CircleLoading.tsx',
          name: 'CircleLoading',
          extension: '.tsx',
        },
        pattern: 'src/components/**',
        nameRules: NC.PASCAL_CASE,
      },
      'src/components/List/index.tsx': {
        pathParts: {
          filename: 'index.tsx',
          name: 'index',
          extension: '.tsx',
        },
        pattern: 'src/components/**',
        nameRules: NC.PASCAL_CASE,
      },
      'src/pages/user/login/components/CircleLoading.tsx': {
        pathParts: {
          filename: 'CircleLoading.tsx',
          name: 'CircleLoading',
          extension: '.tsx',
        },
        pattern: 'src/pages/user/login/components/**',
        nameRules: NC.PASCAL_CASE,
      },
      'config.js': {
        pathParts: {
          filename: 'config.js',
          name: 'config',
          extension: '.js',
        },
        pattern: '*',
        nameRules: NC.SNAKE_CASE,
      },
    })
  })

  test('the scope of overriding rules is larger than rules', async () => {
    expect(
      await getNameLintMaterialsByPath(case1BasePath, {
        rules: {
          'src/components/**': {
            '.tsx': NC.PASCAL_CASE,
          },
          'src/pages/user/login/components/**': {
            '.tsx': NC.PASCAL_CASE,
          },
        },
        overriding: {
          rules: {
            'src/**/components/**': {
              '.tsx': NC.CAMEL_CASE,
            },
          },
        },
      }),
    ).toStrictEqual<NameLintMaterialsByPath>({
      'src/components/List/CircleLoading.tsx': {
        pathParts: {
          filename: 'CircleLoading.tsx',
          name: 'CircleLoading',
          extension: '.tsx',
        },
        pattern: 'src/**/components/**',
        nameRules: NC.CAMEL_CASE,
      },
      'src/components/List/index.tsx': {
        pathParts: {
          filename: 'index.tsx',
          name: 'index',
          extension: '.tsx',
        },
        pattern: 'src/**/components/**',
        nameRules: NC.CAMEL_CASE,
      },
      'src/pages/user/login/components/CircleLoading.tsx': {
        pathParts: {
          filename: 'CircleLoading.tsx',
          name: 'CircleLoading',
          extension: '.tsx',
        },
        pattern: 'src/**/components/**',
        nameRules: NC.CAMEL_CASE,
      },
    })
  })

  test('the scope of overriding rules is smaller than rules', async () => {
    expect(
      await getNameLintMaterialsByPath(case1BasePath, {
        rules: {
          'src/components/**': {
            '.tsx': NC.PASCAL_CASE,
          },
          'src/pages/user/login/components/**': {
            '.tsx': NC.PASCAL_CASE,
          },
        },
        overriding: {
          rules: {
            'src/pages/user/login/components/**': {
              '.tsx': NC.CAMEL_CASE,
            },
          },
        },
      }),
    ).toStrictEqual<NameLintMaterialsByPath>({
      'src/components/List/CircleLoading.tsx': {
        pathParts: {
          filename: 'CircleLoading.tsx',
          name: 'CircleLoading',
          extension: '.tsx',
        },
        pattern: 'src/components/**',
        nameRules: NC.PASCAL_CASE,
      },
      'src/components/List/index.tsx': {
        pathParts: {
          filename: 'index.tsx',
          name: 'index',
          extension: '.tsx',
        },
        pattern: 'src/components/**',
        nameRules: NC.PASCAL_CASE,
      },
      'src/pages/user/login/components/CircleLoading.tsx': {
        pathParts: {
          filename: 'CircleLoading.tsx',
          name: 'CircleLoading',
          extension: '.tsx',
        },
        pattern: 'src/pages/user/login/components/**',
        nameRules: NC.CAMEL_CASE,
      },
    })
  })

  test('the scope of overriding rules and rules intersect', async () => {
    expect(
      await getNameLintMaterialsByPath(case1BasePath, {
        rules: {
          'src/components/**': {
            '.tsx': NC.PASCAL_CASE,
          },
          'src/pages/user/login/components/**': {
            '.tsx': NC.PASCAL_CASE,
          },
        },
        overriding: {
          rules: {
            'src/pages/**/components/**': {
              '.tsx': NC.CAMEL_CASE,
            },
          },
        },
      }),
    ).toStrictEqual<NameLintMaterialsByPath>({
      'src/components/List/CircleLoading.tsx': {
        pathParts: {
          filename: 'CircleLoading.tsx',
          name: 'CircleLoading',
          extension: '.tsx',
        },
        pattern: 'src/components/**',
        nameRules: NC.PASCAL_CASE,
      },
      'src/components/List/index.tsx': {
        pathParts: {
          filename: 'index.tsx',
          name: 'index',
          extension: '.tsx',
        },
        pattern: 'src/components/**',
        nameRules: NC.PASCAL_CASE,
      },
      'src/pages/user/login/components/CircleLoading.tsx': {
        pathParts: {
          filename: 'CircleLoading.tsx',
          name: 'CircleLoading',
          extension: '.tsx',
        },
        pattern: 'src/pages/**/components/**',
        nameRules: NC.CAMEL_CASE,
      },
    })
  })

  test('overriding rules and rules do not overlap', async () => {
    expect(
      await getNameLintMaterialsByPath(case1BasePath, {
        rules: {
          'src/components/**': {
            '.tsx': NC.PASCAL_CASE,
          },
          'src/pages/user/login/components/**': {
            '.tsx': NC.PASCAL_CASE,
          },
        },
        overriding: {
          rules: {
            'src/pages/user/components/**': {
              '.tsx': NC.CAMEL_CASE,
            },
          },
        },
      }),
    ).toStrictEqual<NameLintMaterialsByPath>({
      'src/components/List/CircleLoading.tsx': {
        pathParts: {
          filename: 'CircleLoading.tsx',
          name: 'CircleLoading',
          extension: '.tsx',
        },
        pattern: 'src/components/**',
        nameRules: NC.PASCAL_CASE,
      },
      'src/components/List/index.tsx': {
        pathParts: {
          filename: 'index.tsx',
          name: 'index',
          extension: '.tsx',
        },
        pattern: 'src/components/**',
        nameRules: NC.PASCAL_CASE,
      },
      'src/pages/user/login/components/CircleLoading.tsx': {
        pathParts: {
          filename: 'CircleLoading.tsx',
          name: 'CircleLoading',
          extension: '.tsx',
        },
        pattern: 'src/pages/user/login/components/**',
        nameRules: NC.PASCAL_CASE,
      },
    })
  })

  test('deep overriding rules(consecutive)', async () => {
    expect(
      await getNameLintMaterialsByPath(case1BasePath, {
        rules: {
          'src/components/**': {
            '.tsx': NC.PASCAL_CASE,
          },
          'src/pages/user/login/components/**': {
            '.tsx': NC.PASCAL_CASE,
          },
        },
        overriding: {
          rules: {
            'src/pages/user/login/components/**': {
              '.tsx': NC.CAMEL_CASE,
            },
          },
          overriding: {
            rules: {
              'src/pages/user/login/components/**': {
                '.tsx': NC.SNAKE_CASE,
              },
            },
          },
        },
      }),
    ).toStrictEqual<NameLintMaterialsByPath>({
      'src/components/List/CircleLoading.tsx': {
        pathParts: {
          filename: 'CircleLoading.tsx',
          name: 'CircleLoading',
          extension: '.tsx',
        },
        pattern: 'src/components/**',
        nameRules: NC.PASCAL_CASE,
      },
      'src/components/List/index.tsx': {
        pathParts: {
          filename: 'index.tsx',
          name: 'index',
          extension: '.tsx',
        },
        pattern: 'src/components/**',
        nameRules: NC.PASCAL_CASE,
      },
      'src/pages/user/login/components/CircleLoading.tsx': {
        pathParts: {
          filename: 'CircleLoading.tsx',
          name: 'CircleLoading',
          extension: '.tsx',
        },
        pattern: 'src/pages/user/login/components/**',
        nameRules: NC.SNAKE_CASE,
      },
    })
  })

  test('deep overriding rules(not consecutive)', async () => {
    expect(
      await getNameLintMaterialsByPath(case1BasePath, {
        rules: {
          'src/components/**': {
            '.tsx': NC.PASCAL_CASE,
          },
          'src/pages/user/login/components/**': {
            '.tsx': NC.PASCAL_CASE,
          },
        },
        overriding: {
          rules: {},
          overriding: {
            rules: {
              'src/pages/user/login/components/**': {
                '.tsx': NC.CAMEL_CASE,
              },
            },
          },
        },
      }),
    ).toStrictEqual<NameLintMaterialsByPath>({
      'src/components/List/CircleLoading.tsx': {
        pathParts: {
          filename: 'CircleLoading.tsx',
          name: 'CircleLoading',
          extension: '.tsx',
        },
        pattern: 'src/components/**',
        nameRules: NC.PASCAL_CASE,
      },
      'src/components/List/index.tsx': {
        pathParts: {
          filename: 'index.tsx',
          name: 'index',
          extension: '.tsx',
        },
        pattern: 'src/components/**',
        nameRules: NC.PASCAL_CASE,
      },
      'src/pages/user/login/components/CircleLoading.tsx': {
        pathParts: {
          filename: 'CircleLoading.tsx',
          name: 'CircleLoading',
          extension: '.tsx',
        },
        pattern: 'src/pages/user/login/components/**',
        nameRules: NC.PASCAL_CASE,
      },
    })
  })
})

describe('lint', () => {
  test('wrong format of nameLintConfig', async () => {
    // @ts-ignore
    expect(await lint(case1BasePath, {})).toBe(false)
  })

  test('rules overlap', async () => {
    expect(
      await lint(case1BasePath, {
        rules: {
          'src/components/**': {
            '.tsx': NC.PASCAL_CASE,
          },
          'src/**/components/**': {
            '.tsx': NC.PASCAL_CASE,
          },
        },
      }),
    ).toBe(false)
  })

  test('all filenames are ok', async () => {
    expect(
      await lint(case1BasePath, {
        rules: {
          'src/**/components/**': {
            '.tsx': [NC.PASCAL_CASE, /index/],
          },
          'src/*': {
            '.js': NC.SNAKE_CASE,
          },
        },
        overriding: {
          rules: {
            'src/pages/**/components/**': {
              '.tsx': NC.PASCAL_CASE,
            },
          },
        },
      }),
    ).toBe(true)
  })

  test('not all filenames are ok', async () => {
    expect(
      await lint(case2BasePath, {
        rules: {
          'src/**/components/**': {
            '.tsx': [NC.PASCAL_CASE, /index/],
          },
          '*': {
            '.js': NC.SNAKE_CASE,
          },
        },
        overriding: {
          rules: {
            'src/pages/**/components/**': {
              '.tsx': NC.PASCAL_CASE,
            },
          },
        },
      }),
    ).toBe(false)
  })
})
