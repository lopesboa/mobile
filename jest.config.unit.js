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
    'node_modules/@coorpacademy/(?!(.*-)?react-(.*-)?(native|universal|navigation|router|native-iphone-x-helper|native-deck-swiper)(-.*)?)',
    'node_modules/core-js'
  ],
  setupFiles: ['./jest-setup.js'],
  collectCoverage: true,
  coverageReporters: ['lcov', 'text', 'html'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.js',
    '!<rootDir>/src/*.js',
    '!<rootDir>/src/utils/tests.js',
    '!<rootDir>/src/**/*.stories.js',
    '!<rootDir>/src/screens/*',
    '!<rootDir>/src/containers/*',
    '!<rootDir>/src/navigator/*',
    '!**/__fixtures__/**',
    '!<rootDir>/src/layer/data/progressions.js',
    '!<rootDir>/src/layer/data/recommendations.js',
    '!<rootDir>/src/redux/actions/progression.js',
    // @todo remove this once the layer/data/base folder has been removed
    '!<rootDir>/src/layer/data/base/*.js'
  ],
  coverageThreshold: {
    'src/components': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    },
    'src/redux': {
      branches: 92,
      function: 100,
      lines: 100,
      statements: 100
    },
    'src/layer': {
      // @todo increase this value
      branches: 83,
      function: 98,
      lines: 98,
      statements: 98
    },
    'src/modules': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  verbose: true
};
