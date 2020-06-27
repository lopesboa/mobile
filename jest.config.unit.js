// @flow

module.exports = {
  preset: 'react-native',
  moduleFileExtensions: [
    'unit.js',
    'unit.json',
    'ios.js',
    'android.js',
    'js',
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node'
  ],
  moduleNameMapper: {
    '^[./a-zA-Z0-9$_-]+.png$': '<rootDir>/assets-transformer.js',
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
    '<rootDir>/src/**/*.ts',
    '<rootDir>/src/**/*.tsx',
    '!<rootDir>/src/**/*.e2e.js',
    '!<rootDir>/src/*.js',
    '!<rootDir>/src/*.ts',
    '!<rootDir>/src/*.tsx',
    '!<rootDir>/src/utils/tests.js',
    '!<rootDir>/src/utils/tests.ts',
    '!<rootDir>/src/utils/tests.tsx',
    '!<rootDir>/src/**/*.stories.js',
    '!<rootDir>/src/**/*.stories.ts',
    '!<rootDir>/src/**/*.stories.tsx',
    '!<rootDir>/src/navigator/*',
    '!**/__fixtures__/**',
    '!**/@types/**'
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
      branches: 56,
      // @todo increase this value
      functions: 63,
      // @todo increase this value
      lines: 64,
      // @todo increase this value
      statements: 65
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
      branches: 94,
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
    },
    'src/migrations': {
      branches: 100,
      function: 100,
      lines: 100,
      statements: 100
    }
  },
  verbose: true
};
