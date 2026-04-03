import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'

const eslintConfig = defineConfig([
  ...nextVitals,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
  {
    rules: {
      'no-useless-escape': 'off',
      // Next.js 16 / eslint-config-next enables this; existing Pages Router patterns
      // set derived UI state in effects (e.g. from router query). Safe to relax here.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
])

export default eslintConfig
