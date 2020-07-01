/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const createBlacklist = require('metro-config/src/defaults/blacklist');

const version = require('./src/modules/version');

const DEFAULT_EXTENSIONS = ['js', 'ts', 'tsx'];

module.exports = {
  resolver: {
    sourceExts:
      version.buildFlavor === 'e2e' ? ['e2e.ts', ...DEFAULT_EXTENSIONS] : DEFAULT_EXTENSIONS,
    blacklistRE: (() => {
      if (version.buildFlavor === 'storybook') {
        // this is to have fixtures embedded in storybook app
        return createBlacklist([]);
      }
    })(),
  },
  transformer: {
    getTransformOptions: () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
};
