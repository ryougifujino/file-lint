import typescript from 'rollup-plugin-typescript2'
import ttypescript from 'ttypescript'
// eslint-disable-next-line import/extensions
import pkg from './package.json'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'es',
    },
  ],
  external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
  plugins: [
    typescript({
      typescript: ttypescript,
      tsconfigDefaults: {
        compilerOptions: {
          plugins: [
            {
              transform: 'typescript-transform-paths',
              afterDeclarations: true,
            },
          ],
        },
      },
    }),
  ],
}
