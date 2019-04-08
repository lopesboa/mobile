// @flow

module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['unit.js', 'unit.json', 'ios.js', 'android.js', 'js', 'json'],
  moduleNameMapper: {
    '^[./a-zA-Z0-9$_-]+.png$': 'RelativeImageStub'
  },
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/react-native/jest/preprocessor.js'
  },
  transformIgnorePatterns: [
    'node_modules/@coorpacademy/(?!(.*-)?react-(.*-)?(native|universal|navigation|router|native-iphone-x-helper|native-deck-swiper)(-.*)?)',
    'node_modules/core-js'
  ],
  setupFiles: ['./jest-setup.js'],
  reporters: ['default', 'jest-junit'],
  collectCoverage: true,
  coverageReporters: ['lcov', 'text', 'html'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.js',
    '!<rootDir>/src/**/*.e2e.js',
    '!<rootDir>/src/*.js',
    '!<rootDir>/src/utils/tests.js',
    '!<rootDir>/src/**/*.stories.js',
    '!<rootDir>/src/screens/*',
    '!<rootDir>/src/containers/*',
    '!<rootDir>/src/navigator/*',
    '!**/__fixtures__/**'
  ],
  coverageThreshold: {
    'src/components': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    },
    'src/redux': {
      branches: 89,
      function: 100,
      lines: 100,
      statements: 100
    },
    'src/layer': {
      // @todo increase this value
      branches: 84,
      function: 100,
      lines: 99,
      statements: 98
    },
    'src/modules': {
      branches: 97,
      functions: 100,
      lines: 100,
      statements: 100
    },
    'src/services': {
      // @todo increase this value
      branches: 87,
      // @todo increase this value
      function: 75,
      // @todo increase this value
      lines: 55,
      // @todo increase this value
      statements: 55
    }
  },
  verbose: true
};
