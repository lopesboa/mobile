module.exports = {
  preset: 'react-native',
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/react-native/jest/preprocessor.js',
  },
  transformIgnorePatterns: [
    'node_modules/@coorpacademy/(?!(.*-)?react-(.*-)?(native|universal|navigation|router|native-iphone-x-helper|native-deck-swiper)(-.*)?)',
    'node_modules/core-js',
  ],
  setupFiles: ['./jest-setup.js'],
  setupTestFrameworkScriptFile: './__e2e__/init.ts',
  reporters: ['default', 'jest-junit'],
  bail: true,
  verbose: true,
};
