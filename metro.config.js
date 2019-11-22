/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const createBlacklist = require('metro-config/src/defaults/blacklist');

const {REACT_NATIVE_FLAVOR} = process.env;

const DEFAULT_EXTENSIONS = ['js', 'ts', 'tsx'];

module.exports = {
  resolver: {
    sourceExts:
      REACT_NATIVE_FLAVOR === 'E2E' ? ['e2e.js', ...DEFAULT_EXTENSIONS] : DEFAULT_EXTENSIONS,
    blacklistRE: (() => {
      if (REACT_NATIVE_FLAVOR === 'STORYBOOK') {
        // this is to have fixtures embedded in storybook app
        return createBlacklist([]);
      }
    })()
  },
  transformer: {
    getTransformOptions: () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false
      }
    })
  }
};
