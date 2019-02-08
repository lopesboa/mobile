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
    'node_modules/@coorpacademy/(?!(.*-)?react-(.*-)?(native|universal|navigation|router|native-iphone-x-helper|native-deck-swiper)(-.*)?)'
  ],
  setupFiles: ['./jest-setup.js'],
  collectCoverage: true,
  coverageReporters: ['lcov', 'text', 'html'],
  coveragePathIgnorePatterns: [
    'node_modules',
    'jest-setup.js',
    'src/*.js',
    '<rootDir>/src/layer/data/progressions.js',
    '<rootDir>/src/layer/data/recommendations.js'
  ],
  coverageThreshold: {
    'src/components': {
      branches: 100,
      functions: 98,
      lines: 100,
      statements: 99
    },
    'src/redux': {
      branches: 90,
      function: 100,
      lines: 100,
      statements: 100
    },
    'src/layer': {
      // @todo increase this value
      branches: 78,
      function: 100,
      lines: 99,
      statements: 98
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
