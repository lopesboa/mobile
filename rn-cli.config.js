module.exports = {
  getSourceExts: () => {
    return process.env.RN_FLAVOR === 'E2E' ? ['e2e.js'] : [];
  },
};
