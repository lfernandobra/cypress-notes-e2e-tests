import js from '@eslint/js'
import pluginCypress from 'eslint-plugin-cypress'
import globals from 'globals'

const styleRules = {
  indent: ['error', 2],
  'linebreak-style': ['error', 'unix'],
  quotes: ['error', 'single'],
  semi: ['error', 'never'],
  'no-trailing-spaces': 'error',
}

export default [
  {
    ignores: [
      'node_modules/**',
      'cypress/screenshots/**',
      'cypress/videos/**',
      'cypress/downloads/**',
    ],
  },
  js.configs.recommended,
  {
    files: ['cypress.config.js', 'eslint.config.mjs'],
    languageOptions: {
      globals: globals.node,
    },
    rules: styleRules,
  },
  {
    files: ['cypress/**/*.js'],
    ...pluginCypress.configs.recommended,
    rules: {
      ...pluginCypress.configs.recommended.rules,
      ...styleRules,
    },
  },
]
