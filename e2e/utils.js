// @flow

const reloadApp = async () => {
  await device.reloadReactNative();
};

module.exports = {
  init() {
    // since we mix jest & mocha + detox in our codebase, we cannot use flow
    // with a single config that mix multiples interfaces
    // here is a simple trick to avoid much pain
    // (we force weExpect type to match what we want)
    global.weExpect = expect;
  },
  reloadApp,
};
