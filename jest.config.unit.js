// @flow

module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['unit.js', 'unit.json', 'ios.js', 'android.js', 'js', 'json'],
  moduleNameMapper: {
    '^[./a-zA-Z0-9$_-]+.png$': 'RelativeImageStub',
    '^[./a-zA-Z0-9$_-]+.mp3': '<rootDir>/assets-transformer.js'
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
    'src/containers': {
      // @todo increase this value
      branches: 41,
      // @todo increase this value
      functions: 47,
      // @todo increase this value
      lines: 52,
      // @todo increase this value
      statements: 52
    },
    'src/screens': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    },
    'src/redux': {
      branches: 100,
      function: 100,
      lines: 100,
      statements: 100
    },
    'src/models': {
      branches: 100,
      function: 100,
      lines: 100,
      statements: 100
    },
    'src/layer': {
      // @todo increase this value
      branches: 91,
      function: 100,
      lines: 99,
      statements: 99
    },
    'src/modules': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    },
    'src/services': {
      branches: 100,
      function: 100,
      lines: 100,
      statements: 100
    },
    'src/translations': {
      branches: 100,
      function: 100,
      lines: 100,
      statements: 100
    },
    'src/utils': {
      branches: 100,
      function: 100,
      lines: 100,
      statements: 100
    }
  },
  verbose: true
};
