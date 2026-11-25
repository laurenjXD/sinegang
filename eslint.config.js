import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**', 'tsconfig.tsbuildinfo'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}', 'worker/**/*.ts', 'shared/**/*.ts', 'tests/**/*.ts'],
    languageOptions: { globals: { ...globals.browser, ...globals.worker, ...globals.node } },
    plugins: { 'react-hooks': reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },
  {
    files: ['scripts/**/*.{js,mjs}', 'vite*.ts'],
    languageOptions: { globals: { ...globals.node, ...globals.worker } },
  },
)
