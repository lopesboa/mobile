// @flow

let alreadyLaunched = false;

const reloadApp = async () => {
  // @todo use reloadReactNative(); once it's working in Android
  await device.launchApp({newInstance: !alreadyLaunched});

  if (!alreadyLaunched) {
    alreadyLaunched = true;
  }
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
