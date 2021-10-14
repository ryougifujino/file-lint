/* eslint-disable @typescript-eslint/ban-ts-comment */
import lint, { getNameLintMaterialsByPath, NameLintMaterialsByPath, parsePath } from '@/nameLinter'
import { NC } from '@/nameValidators'
import { resolve } from 'path'

const resolveTestFileTree = (relativePath: string) => resolve(__dirname, 'file-tree-cases', relativePath)
const case1BasePath = resolveTestFileTree('case1')
const case2BasePath = resolveTestFileTree('case2')

test('parsePath', () => {
  expect(parsePath('f')).toStrictEqual({
    filename: 'f',
    name: 'f',
    extension: '',
  })
  expect(parsePath('f/')).toStrictEqual({
    filename: 'f/',
    name: 'f',
    extension: '/',
  })
  expect(parsePath('some/path/f')).toStrictEqual({
    filename: 'f',
    name: 'f',
    extension: '',
  })
  expect(parsePath('some/path/f/')).toStrictEqual({
    filename: 'f/',
    name: 'f',
    extension: '/',
  })
  expect(parsePath('foo')).toStrictEqual({
    filename: 'foo',
    name: 'foo',
    extension: '',
  })
  expect(parsePath('foo.ext')).toStrictEqual({
    filename: 'foo.ext',
    name: 'foo',
    extension: '.ext',
  })
  expect(parsePath('foo.ext.ext')).toStrictEqual({
    filename: 'foo.ext.ext',
    name: 'foo',
    extension: '.ext.ext',
  })
  expect(parsePath('.foo')).toStrictEqual({
    filename: '.foo',
    name: '.foo',
    extension: '',
  })
  expect(parsePath('.foo.ext')).toStrictEqual({
    filename: '.foo.ext',
    name: '.foo',
    extension: '.ext',
  })
  expect(parsePath('.foo.ext.ext')).toStrictEqual({
    filename: '.foo.ext.ext',
    name: '.foo',
    extension: '.ext.ext',
  })
  expect(parsePath('foo/')).toStrictEqual({
    filename: 'foo/',
    name: 'foo',
    extension: '/',
  })
  expect(parsePath('foo.ext/')).toStrictEqual({
    filename: 'foo.ext/',
    name: 'foo.ext',
    extension: '/',
  })
  expect(parsePath('foo.ext.ext/')).toStrictEqual({
    filename: 'foo.ext.ext/',
    name: 'foo.ext.ext',
    extension: '/',
  })
  expect(parsePath('.foo/')).toStrictEqual({
    filename: '.foo/',
    name: '.foo',
    extension: '/',
  })
  expect(parsePath('.foo.ext/')).toStrictEqual({
    filename: '.foo.ext/',
    name: '.foo.ext',
    extension: '/',
  })
  expect(parsePath('.foo.ext.ext/')).toStrictEqual({
    filename: '.foo.ext.ext/',
    name: '.foo.ext.ext',
    extension: '/',
  })
  expect(parsePath('some/path/foo')).toStrictEqual({
    filename: 'foo',
    name: 'foo',
    extension: '',
  })
  expect(parsePath('some/path/foo.ext')).toStrictEqual({
    filename: 'foo.ext',
    name: 'foo',
    extension: '.ext',
  })
  expect(parsePath('some/path/foo.ext.ext')).toStrictEqual({
    filename: 'foo.ext.ext',
    name: 'foo',
    extension: '.ext.ext',
  })
  expect(parsePath('some/path/.foo')).toStrictEqual({
    filename: '.foo',
    name: '.foo',
    extension: '',
  })
  expect(parsePath('some/path/.foo.ext')).toStrictEqual({
    filename: '.foo.ext',
    name: '.foo',
    extension: '.ext',
  })
  expect(parsePath('some/path/.foo.ext.ext')).toStrictEqual({
    filename: '.foo.ext.ext',
    name: '.foo',
    extension: '.ext.ext',
  })
  expect(parsePath('some/path/foo/')).toStrictEqual({
    filename: 'foo/',
    name: 'foo',
    extension: '/',
  })
  expect(parsePath('some/path/foo.ext/')).toStrictEqual({
    filename: 'foo.ext/',
    name: 'foo.ext',
    extension: '/',
  })
  expect(parsePath('some/path/foo.ext.ext/')).toStrictEqual({
    filename: 'foo.ext.ext/',
    name: 'foo.ext.ext',
    extension: '/',
  })
  expect(parsePath('some/path/.foo/')).toStrictEqual({
    filename: '.foo/',
    name: '.foo',
    extension: '/',
  })
  expect(parsePath('some/path/.foo.ext/')).toStrictEqual({
    filename: '.foo.ext/',
    name: '.foo.ext',
    extension: '/',
  })
  expect(parsePath('some/path/.foo.ext.ext/')).toStrictEqual({
    filename: '.foo.ext.ext/',
    name: '.foo.ext.ext',
    extension: '/',
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

  test('overriding rules overlap', async () => {
    expect(
      await getNameLintMaterialsByPath(case1BasePath, {
        rules: {
          'src/**': {
            '.tsx': NC.PASCAL_CASE,
          },
        },
        overriding: {
          rules: {
            'src/components/**': {
              '.tsx': NC.PASCAL_CASE,
            },
            'src/**/components/**': {
              '.tsx': NC.PASCAL_CASE,
            },
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
