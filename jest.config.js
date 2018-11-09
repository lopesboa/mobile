// @flow

module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ios.js', 'android.js', 'js', 'json'],
  moduleNameMapper: {
    '^[./a-zA-Z0-9$_-]+.png$': 'RelativeImageStub',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(.*-)?react-(.*-)?(native|universal|navigation|router|native-iphone-x-helper)(-.*)?)',
  ],
  testPathIgnorePatterns: ['node_modules', '/__fixtures__/', '__mocks__'],
  setupFiles: ['./jest-setup.js'],
};
