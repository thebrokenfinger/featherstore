const path = require('path');

module.exports = {
  rootDir: path.resolve(__dirname),
  verbose: true,
  silent: false,
  bail: true,
  testEnvironment: 'jsdom',
  moduleDirectories: ['node_modules'],
  setupFiles: ['<rootDir>/test/setup.js'],
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.js$',
  transform: {
    '.+\\.js$': '<rootDir>/node_modules/babel-jest'
  }
};
