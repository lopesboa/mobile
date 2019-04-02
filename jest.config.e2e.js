// @flow

module.exports = {
  preset: 'react-native',
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/react-native/jest/preprocessor.js'
  },
  setupFiles: ['./jest-setup.js'],
  setupTestFrameworkScriptFile: './__e2e__/init.js',
  reporters: ['default', 'jest-junit'],
  bail: true,
  verbose: true
};
