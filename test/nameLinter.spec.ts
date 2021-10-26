/* eslint-disable @typescript-eslint/ban-ts-comment */
import lintNames, { getNameLintFuelsByPath, NameLintFuelsByPath, parsePath, SmartFilename } from '@/nameLinter'
import { NC } from '@/nameValidators'
import { resolve } from 'path'

const resolveTestFileTree = (relativePath: string) => resolve(__dirname, 'file-tree-cases', relativePath)
const case1BasePath = resolveTestFileTree('case1')
const case2BasePath = resolveTestFileTree('case2')
const case3BasePath = resolveTestFileTree('case3')

test('parsePath', () => {
  expect(parsePath('f')).toStrictEqual<SmartFilename>({
    filename: 'f',
    nameExtensionCandidates: [
      {
        name: 'f',
        extension: '',
      },
    ],
  })
  expect(parsePath('f/')).toStrictEqual<SmartFilename>({
    filename: 'f/',
    nameExtensionCandidates: [
      {
        name: 'f',
        extension: '/',
      },
    ],
  })
  expect(parsePath('some/path/f')).toStrictEqual<SmartFilename>({
    filename: 'f',
    nameExtensionCandidates: [
      {
        name: 'f',
        extension: '',
      },
    ],
  })
  expect(parsePath('some/path/f/')).toStrictEqual<SmartFilename>({
    filename: 'f/',
    nameExtensionCandidates: [
      {
        name: 'f',
        extension: '/',
      },
    ],
  })
  expect(parsePath('foo')).toStrictEqual<SmartFilename>({
    filename: 'foo',
    nameExtensionCandidates: [
      {
        name: 'foo',
        extension: '',
      },
    ],
  })
  expect(parsePath('foo.bar')).toStrictEqual<SmartFilename>({
    filename: 'foo.bar',
    nameExtensionCandidates: [
      {
        name: 'foo',
        extension: '.bar',
      },
    ],
  })
  expect(parsePath('foo.bar.bar')).toStrictEqual<SmartFilename>({
    filename: 'foo.bar.bar',
    nameExtensionCandidates: [
      {
        name: 'foo',
        extension: '.bar.bar',
      },
      {
        name: 'foo.bar',
        extension: '.bar',
      },
    ],
  })
  expect(parsePath('.foo')).toStrictEqual<SmartFilename>({
    filename: '.foo',
    nameExtensionCandidates: [
      {
        name: '.foo',
        extension: '',
      },
    ],
  })
  expect(parsePath('.foo.bar')).toStrictEqual<SmartFilename>({
    filename: '.foo.bar',
    nameExtensionCandidates: [
      {
        name: '.foo',
        extension: '.bar',
      },
    ],
  })
  expect(parsePath('.foo.bar.bar')).toStrictEqual<SmartFilename>({
    filename: '.foo.bar.bar',
    nameExtensionCandidates: [
      {
        name: '.foo',
        extension: '.bar.bar',
      },
      {
        name: '.foo.bar',
        extension: '.bar',
      },
    ],
  })
  expect(parsePath('foo/')).toStrictEqual<SmartFilename>({
    filename: 'foo/',
    nameExtensionCandidates: [
      {
        name: 'foo',
        extension: '/',
      },
    ],
  })
  expect(parsePath('foo.bar/')).toStrictEqual<SmartFilename>({
    filename: 'foo.bar/',
    nameExtensionCandidates: [
      {
        name: 'foo.bar',
        extension: '/',
      },
    ],
  })
  expect(parsePath('foo.bar.bar/')).toStrictEqual<SmartFilename>({
    filename: 'foo.bar.bar/',
    nameExtensionCandidates: [
      {
        name: 'foo.bar.bar',
        extension: '/',
      },
    ],
  })
  expect(parsePath('.foo/')).toStrictEqual<SmartFilename>({
    filename: '.foo/',
    nameExtensionCandidates: [
      {
        name: '.foo',
        extension: '/',
      },
    ],
  })
  expect(parsePath('.foo.bar/')).toStrictEqual<SmartFilename>({
    filename: '.foo.bar/',
    nameExtensionCandidates: [
      {
        name: '.foo.bar',
        extension: '/',
      },
    ],
  })
  expect(parsePath('.foo.bar.bar/')).toStrictEqual<SmartFilename>({
    filename: '.foo.bar.bar/',
    nameExtensionCandidates: [
      {
        name: '.foo.bar.bar',
        extension: '/',
      },
    ],
  })
  expect(parsePath('some/path/foo')).toStrictEqual<SmartFilename>({
    filename: 'foo',
    nameExtensionCandidates: [
      {
        name: 'foo',
        extension: '',
      },
    ],
  })
  expect(parsePath('some/path/foo.bar')).toStrictEqual<SmartFilename>({
    filename: 'foo.bar',
    nameExtensionCandidates: [
      {
        name: 'foo',
        extension: '.bar',
      },
    ],
  })
  expect(parsePath('some/path/foo.bar.bar')).toStrictEqual<SmartFilename>({
    filename: 'foo.bar.bar',
    nameExtensionCandidates: [
      {
        name: 'foo',
        extension: '.bar.bar',
      },
      {
        name: 'foo.bar',
        extension: '.bar',
      },
    ],
  })
  expect(parsePath('some/path/.foo')).toStrictEqual<SmartFilename>({
    filename: '.foo',
    nameExtensionCandidates: [
      {
        name: '.foo',
        extension: '',
      },
    ],
  })
  expect(parsePath('some/path/.foo.bar')).toStrictEqual<SmartFilename>({
    filename: '.foo.bar',
    nameExtensionCandidates: [
      {
        name: '.foo',
        extension: '.bar',
      },
    ],
  })
  expect(parsePath('some/path/.foo.bar.bar')).toStrictEqual<SmartFilename>({
    filename: '.foo.bar.bar',
    nameExtensionCandidates: [
      {
        name: '.foo',
        extension: '.bar.bar',
      },
      {
        name: '.foo.bar',
        extension: '.bar',
      },
    ],
  })
  expect(parsePath('some/path/foo/')).toStrictEqual<SmartFilename>({
    filename: 'foo/',
    nameExtensionCandidates: [
      {
        name: 'foo',
        extension: '/',
      },
    ],
  })
  expect(parsePath('some/path/foo.bar/')).toStrictEqual<SmartFilename>({
    filename: 'foo.bar/',
    nameExtensionCandidates: [
      {
        name: 'foo.bar',
        extension: '/',
      },
    ],
  })
  expect(parsePath('some/path/foo.bar.bar/')).toStrictEqual<SmartFilename>({
    filename: 'foo.bar.bar/',
    nameExtensionCandidates: [
      {
        name: 'foo.bar.bar',
        extension: '/',
      },
    ],
  })
  expect(parsePath('some/path/.foo/')).toStrictEqual<SmartFilename>({
    filename: '.foo/',
    nameExtensionCandidates: [
      {
        name: '.foo',
        extension: '/',
      },
    ],
  })
  expect(parsePath('some/path/.foo.bar/')).toStrictEqual<SmartFilename>({
    filename: '.foo.bar/',
    nameExtensionCandidates: [
      {
        name: '.foo.bar',
        extension: '/',
      },
    ],
  })
  expect(parsePath('some/path/.foo.bar.bar/')).toStrictEqual<SmartFilename>({
    filename: '.foo.bar.bar/',
    nameExtensionCandidates: [
      {
        name: '.foo.bar.bar',
        extension: '/',
      },
    ],
  })
})

describe('getNameLintFuelsByPath', () => {
  test('rules overlap', async () => {
    expect(
      await getNameLintFuelsByPath(case1BasePath, {
        rules: {
          'src/components/**': {
            '.tsx': NC.PASCAL_CASE,
          },
          'src/**/components/**': {
            '.tsx': NC.PASCAL_CASE,
          },
        },
      }),
    ).toBe<NameLintFuelsByPath | null>(null)
  })

  test('overriding rules overlap', async () => {
    expect(
      await getNameLintFuelsByPath(case1BasePath, {
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
    ).toBe<NameLintFuelsByPath | null>(null)
  })

  test('rules do not overlap(without overriding rules)', async () => {
    expect(
      await getNameLintFuelsByPath(case1BasePath, {
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
    ).toStrictEqual<NameLintFuelsByPath | null>({
      'src/components/List/CircleLoading.tsx': {
        pattern: 'src/components/**',
        extension: '.tsx',
        nameRules: NC.PASCAL_CASE,
        name: 'CircleLoading',
        filename: 'CircleLoading.tsx',
      },
      'src/components/List/index.tsx': {
        pattern: 'src/components/**',
        extension: '.tsx',
        nameRules: NC.PASCAL_CASE,
        name: 'index',
        filename: 'index.tsx',
      },
      'src/pages/user/login/components/CircleLoading.tsx': {
        pattern: 'src/pages/user/login/components/**',
        extension: '.tsx',
        nameRules: NC.PASCAL_CASE,
        name: 'CircleLoading',
        filename: 'CircleLoading.tsx',
      },
      'config.js': {
        pattern: '*',
        extension: '.js',
        nameRules: NC.SNAKE_CASE,
        name: 'config',
        filename: 'config.js',
      },
    })
  })

  test('the scope of overriding rules is larger than rules', async () => {
    expect(
      await getNameLintFuelsByPath(case1BasePath, {
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
    ).toStrictEqual<NameLintFuelsByPath | null>({
      'src/components/List/CircleLoading.tsx': {
        pattern: 'src/**/components/**',
        extension: '.tsx',
        nameRules: NC.CAMEL_CASE,
        name: 'CircleLoading',
        filename: 'CircleLoading.tsx',
      },
      'src/components/List/index.tsx': {
        pattern: 'src/**/components/**',
        extension: '.tsx',
        nameRules: NC.CAMEL_CASE,
        name: 'index',
        filename: 'index.tsx',
      },
      'src/pages/user/login/components/CircleLoading.tsx': {
        pattern: 'src/**/components/**',
        extension: '.tsx',
        nameRules: NC.CAMEL_CASE,
        name: 'CircleLoading',
        filename: 'CircleLoading.tsx',
      },
    })
  })

  test('the scope of overriding rules is smaller than rules', async () => {
    expect(
      await getNameLintFuelsByPath(case1BasePath, {
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
    ).toStrictEqual<NameLintFuelsByPath | null>({
      'src/components/List/CircleLoading.tsx': {
        pattern: 'src/components/**',
        extension: '.tsx',
        nameRules: NC.PASCAL_CASE,
        name: 'CircleLoading',
        filename: 'CircleLoading.tsx',
      },
      'src/components/List/index.tsx': {
        pattern: 'src/components/**',
        extension: '.tsx',
        nameRules: NC.PASCAL_CASE,
        name: 'index',
        filename: 'index.tsx',
      },
      'src/pages/user/login/components/CircleLoading.tsx': {
        pattern: 'src/pages/user/login/components/**',
        extension: '.tsx',
        nameRules: NC.CAMEL_CASE,
        name: 'CircleLoading',
        filename: 'CircleLoading.tsx',
      },
    })
  })

  test('the scope of overriding rules and rules intersect', async () => {
    expect(
      await getNameLintFuelsByPath(case1BasePath, {
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
    ).toStrictEqual<NameLintFuelsByPath | null>({
      'src/components/List/CircleLoading.tsx': {
        pattern: 'src/components/**',
        extension: '.tsx',
        nameRules: NC.PASCAL_CASE,
        name: 'CircleLoading',
        filename: 'CircleLoading.tsx',
      },
      'src/components/List/index.tsx': {
        pattern: 'src/components/**',
        extension: '.tsx',
        nameRules: NC.PASCAL_CASE,
        name: 'index',
        filename: 'index.tsx',
      },
      'src/pages/user/login/components/CircleLoading.tsx': {
        pattern: 'src/pages/**/components/**',
        extension: '.tsx',
        nameRules: NC.CAMEL_CASE,
        name: 'CircleLoading',
        filename: 'CircleLoading.tsx',
      },
    })
  })

  test('overriding rules and rules do not overlap', async () => {
    expect(
      await getNameLintFuelsByPath(case1BasePath, {
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
    ).toStrictEqual<NameLintFuelsByPath | null>({
      'src/components/List/CircleLoading.tsx': {
        pattern: 'src/components/**',
        extension: '.tsx',
        nameRules: NC.PASCAL_CASE,
        name: 'CircleLoading',
        filename: 'CircleLoading.tsx',
      },
      'src/components/List/index.tsx': {
        pattern: 'src/components/**',
        extension: '.tsx',
        nameRules: NC.PASCAL_CASE,
        name: 'index',
        filename: 'index.tsx',
      },
      'src/pages/user/login/components/CircleLoading.tsx': {
        pattern: 'src/pages/user/login/components/**',
        extension: '.tsx',
        nameRules: NC.PASCAL_CASE,
        name: 'CircleLoading',
        filename: 'CircleLoading.tsx',
      },
    })
  })

  test('deep overriding rules(consecutive)', async () => {
    expect(
      await getNameLintFuelsByPath(case1BasePath, {
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
    ).toStrictEqual<NameLintFuelsByPath | null>({
      'src/components/List/CircleLoading.tsx': {
        pattern: 'src/components/**',
        extension: '.tsx',
        nameRules: NC.PASCAL_CASE,
        name: 'CircleLoading',
        filename: 'CircleLoading.tsx',
      },
      'src/components/List/index.tsx': {
        pattern: 'src/components/**',
        extension: '.tsx',
        nameRules: NC.PASCAL_CASE,
        name: 'index',
        filename: 'index.tsx',
      },
      'src/pages/user/login/components/CircleLoading.tsx': {
        pattern: 'src/pages/user/login/components/**',
        extension: '.tsx',
        nameRules: NC.SNAKE_CASE,
        name: 'CircleLoading',
        filename: 'CircleLoading.tsx',
      },
    })
  })

  test('deep overriding rules(not consecutive)', async () => {
    expect(
      await getNameLintFuelsByPath(case1BasePath, {
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
    ).toStrictEqual<NameLintFuelsByPath | null>({
      'src/components/List/CircleLoading.tsx': {
        pattern: 'src/components/**',
        extension: '.tsx',
        nameRules: NC.PASCAL_CASE,
        name: 'CircleLoading',
        filename: 'CircleLoading.tsx',
      },
      'src/components/List/index.tsx': {
        pattern: 'src/components/**',
        extension: '.tsx',
        nameRules: NC.PASCAL_CASE,
        name: 'index',
        filename: 'index.tsx',
      },
      'src/pages/user/login/components/CircleLoading.tsx': {
        pattern: 'src/pages/user/login/components/**',
        extension: '.tsx',
        nameRules: NC.PASCAL_CASE,
        name: 'CircleLoading',
        filename: 'CircleLoading.tsx',
      },
    })
  })

  test('when lacking the exact extension matching, the sub-extension will hit', async () => {
    expect(
      await getNameLintFuelsByPath(case3BasePath, {
        rules: {
          '**': {
            '.ts': NC.CAMEL_CASE,
          },
        },
      }),
    ).toStrictEqual<NameLintFuelsByPath | null>({
      'core/browserEngine.ts': {
        pattern: '**',
        extension: '.ts',
        nameRules: NC.CAMEL_CASE,
        name: 'browserEngine',
        filename: 'browserEngine.ts',
      },
      'core/browserEngine.d.ts': {
        pattern: '**',
        extension: '.ts',
        nameRules: NC.CAMEL_CASE,
        name: 'browserEngine.d',
        filename: 'browserEngine.d.ts',
      },
    })
  })

  test('longest extension matching principle', async () => {
    expect(
      await getNameLintFuelsByPath(case3BasePath, {
        rules: {
          '**': {
            '.ts': NC.CAMEL_CASE,
            '.d.ts': NC.PASCAL_CASE,
          },
        },
      }),
    ).toStrictEqual<NameLintFuelsByPath | null>({
      'core/browserEngine.ts': {
        pattern: '**',
        extension: '.ts',
        nameRules: NC.CAMEL_CASE,
        name: 'browserEngine',
        filename: 'browserEngine.ts',
      },
      'core/browserEngine.d.ts': {
        pattern: '**',
        extension: '.d.ts',
        nameRules: NC.PASCAL_CASE,
        name: 'browserEngine',
        filename: 'browserEngine.d.ts',
      },
    })
  })

  test('overriding rules will only override the rules with the same extension', async () => {
    expect(
      await getNameLintFuelsByPath(case3BasePath, {
        rules: {
          '**': {
            '.ts': NC.CAMEL_CASE,
            '.d.ts': NC.PASCAL_CASE,
          },
        },
        overriding: {
          rules: {
            'core/**': {
              '.ts': NC.SNAKE_CASE,
            },
          },
        },
      }),
    ).toStrictEqual<NameLintFuelsByPath | null>({
      'core/browserEngine.ts': {
        pattern: 'core/**',
        extension: '.ts',
        nameRules: NC.SNAKE_CASE,
        name: 'browserEngine',
        filename: 'browserEngine.ts',
      },
      'core/browserEngine.d.ts': {
        pattern: '**',
        extension: '.d.ts',
        nameRules: NC.PASCAL_CASE,
        name: 'browserEngine',
        filename: 'browserEngine.d.ts',
      },
    })
  })
})

describe('lintNames', () => {
  test('wrong format of nameLintConfig', async () => {
    // @ts-ignore
    expect(await lintNames(case1BasePath, {})).toBe(false)
  })

  test('rules overlap', async () => {
    expect(
      await lintNames(case1BasePath, {
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
      await lintNames(case1BasePath, {
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
      await lintNames(case2BasePath, {
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
