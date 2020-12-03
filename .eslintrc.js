const OFF = 0
const WARN = 1
const ERROR = 2

module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'plugin:promise/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['promise', '@typescript-eslint'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.ts', '.js', '.json'],
      },
      typescript: {},
    },
  },
  rules: {
    'import/extensions': [
      ERROR,
      'ignorePackages',
      {
        ts: 'never',
        json: 'never',
        js: 'never',
      },
    ],
    '@typescript-eslint/no-useless-constructor': ERROR,
    '@typescript-eslint/no-empty-function': WARN,
    '@typescript-eslint/explicit-function-return-type': OFF,
    '@typescript-eslint/explicit-module-boundary-types': OFF,
    '@typescript-eslint/no-use-before-define': ERROR,
    '@typescript-eslint/no-shadow': [ERROR],

    'lines-between-class-members': [ERROR, 'always'],
    'linebreak-style': [ERROR, 'unix'],
    quotes: [ERROR, 'single'],
    semi: [ERROR, 'never'],
    'no-console': OFF,
    'no-unused-expressions': WARN,
    'no-use-before-define': OFF,
    'no-restricted-syntax': OFF,
    'no-shadow': OFF,
    'class-methods-use-this': ERROR,
  },
}
