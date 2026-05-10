import cypress from 'eslint-plugin-cypress';

export default [
  {
    ignores: ['node_modules/', 'dist/', 'cypress/videos/', 'cypress/screenshots/']
  },
  {
    files: ['cypress/e2e/**/*.js', 'cypress.config.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: {
        cy: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        before: 'readonly',
        beforeEach: 'readonly',
        after: 'readonly',
        afterEach: 'readonly',
        Cypress: 'readonly'
      }
    },
    plugins: {
      cypress
    },
    rules: {
      ...cypress.configs.recommended.rules,
      'cypress/unsafe-to-chain-command': 'warn'
    }
  },
  {
    files: ['cypress/support/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        cy: 'readonly',
        Cypress: 'readonly'
      }
    }
  }
];