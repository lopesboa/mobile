// @flow

let alreadyLaunched = false;

const reloadApp = async () => {
  // @todo use reloadReactNative(); once it's working in Android
  await device.launchApp({newInstance: !alreadyLaunched});

  if (!alreadyLaunched) {
    alreadyLaunched = true;
  }
};

export default {
  reloadApp,
};
