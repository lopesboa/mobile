// @flow strict

let alreadyLaunched = false;

const defaultPermissions: DetoxDevicePermissionsType = {
  camera: 'YES',
  microphone: 'YES'
};

export const reloadApp = async (
  additionalPermissions?: DetoxDevicePermissionsType = defaultPermissions,
  newInstance?: boolean = false
) => {
  const permissions: DetoxDevicePermissionsType = {
    ...defaultPermissions,
    ...additionalPermissions
  };
  // @todo use reloadReactNative(); once it's working in Android
  await device.launchApp({newInstance: !alreadyLaunched || newInstance, permissions});

  if (!alreadyLaunched) {
    alreadyLaunched = true;
  }
};

export const getContextTab = (el: DetoxElement) => el(by.id('slide-tab')).atIndex(3);
export const getQuestionTab = (el: DetoxElement) => el(by.id('slide-tab')).atIndex(2);
export const getLessonTab = (el: DetoxElement) => el(by.id('slide-tab')).atIndex(1);
export const getClueTab = (el: DetoxElement) => el(by.id('slide-tab')).atIndex(0);

export const bypassAuthentication = async (el: DetoxElement) => {
  await el(by.id('button-sign-in-desktop')).tap();
  await el(by.id('authentication-details-qr-code-button')).tap();
  await waitFor(el(by.id('qr-code-scanner'))).toExist();
  await weExpect(el(by.id('qr-code-scanner'))).toExist();
  await el(by.id('qr-code-screen')).longPress();
  await waitFor(el(by.id('home'))).toExist();
};

export default {
  reloadApp,
  getQuestionTab,
  getLessonTab,
  getClueTab,
  getContextTab,
  bypassAuthentication
};
