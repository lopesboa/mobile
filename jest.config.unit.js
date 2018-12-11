// @flow

module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ios.js', 'android.js', 'js', 'json'],
  moduleNameMapper: {
    '^[./a-zA-Z0-9$_-]+.png$': 'RelativeImageStub'
  },
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/react-native/jest/preprocessor.js'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(.*-)?react-(.*-)?(native|universal|navigation|router|native-iphone-x-helper)(-.*)?)'
  ],
  setupFiles: ['./jest-setup.js'],
  collectCoverage: true,
  coverageReporters: ['lcov', 'text', 'html'],
  coveragePathIgnorePatterns: ['node_modules', 'jest-setup.js', 'src/*.js'],
  coverageThreshold: {
    'src/components': {
      branches: 100,
      functions: 90,
      lines: 100,
      statements: 90
    },
    'src/modules': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
  // verbose: true,
};
