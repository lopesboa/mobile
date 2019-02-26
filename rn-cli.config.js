const {Config, createBlacklist} = require('metro');

const {REACT_NATIVE_FLAVOR} = process.env;

module.exports = {
  getSourceExts: () => {
    return REACT_NATIVE_FLAVOR === 'E2E' ? ['e2e.js'] : [];
  },
  getBlacklistRE: () => {
    if (process.env.REACT_NATIVE_ENVIRONMENT_STORYBOOK) {
      // this is to have fixtures embedded in storybook app
      return createBlacklist([]);
    }

    return Config.DEFAULT.getBlacklistRE();
  }
};
