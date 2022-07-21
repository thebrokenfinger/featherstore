const path = require('path')

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: path.resolve(__dirname),
  verbose: true,
  silent: false,
  bail: true,
  testEnvironment: 'jsdom',
  moduleDirectories: ['node_modules'],
  setupFiles: ['<rootDir>/test/setup.ts'],
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.ts$',
  transform: {
    '.+\\.ts$': '<rootDir>/node_modules/babel-jest',
  },
}
