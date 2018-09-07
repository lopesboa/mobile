/* eslint-disable */

module.exports = {
  getSourceExts: () => (process.env.RN_FLAVOR === 'E2E' ? ['e2e.js'] : []),
};
