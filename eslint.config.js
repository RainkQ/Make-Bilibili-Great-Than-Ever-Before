'use strict';

module.exports = require('eslint-config-sukka').sukka(
  {},
  {
    rules: {
      'no-restricted-globals': [
        'error',
        'window', // use unsafeWindow instead
        'console' // use logger
      ]
    }
  },
  {
    files: ['src/**/*.ts'],
    rules: {
      'n/prefer-global/process': 'off',
      'sukka/prefer-timer-id': 'off'
    }
  },
  {
    ignores: ['scripts/']
  }
);
