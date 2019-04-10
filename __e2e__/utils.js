// @flow

let alreadyLaunched = false;

const defaultPermissions: DetoxDevicePermissionsType = {
  camera: 'YES'
};

export const reloadApp = async (
  additionalPermissions?: DetoxDevicePermissionsType = defaultPermissions
) => {
  const permissions: DetoxDevicePermissionsType = {
    ...defaultPermissions,
    ...additionalPermissions
  };
  // @todo use reloadReactNative(); once it's working in Android
  await device.launchApp({newInstance: !alreadyLaunched, permissions});

  if (!alreadyLaunched) {
    alreadyLaunched = true;
  }
};

export const getContextTab = (el: DetoxElement) => el(by.id('slide-tab')).atIndex(3);
export const getQuestionTab = (el: DetoxElement) => el(by.id('slide-tab')).atIndex(2);
export const getLessonTab = (el: DetoxElement) => el(by.id('slide-tab')).atIndex(1);
export const getClueTab = (el: DetoxElement) => el(by.id('slide-tab')).atIndex(0);

export const bypassAuthentication = async () => {
  await waitFor(element(by.id('authentication-screen'))).toBeVisible();
  await waitFor(element(by.id('button-scan-qr-code'))).toBeVisible();
  await element(by.id('button-scan-qr-code')).tap();
  await waitFor(element(by.id('qr-code-screen'))).toBeVisible();
  await weExpect(element(by.id('qr-code-screen'))).toBeVisible();
  await element(by.id('qr-code-screen')).longPress();
  await weExpect(element(by.id('home-screen'))).toBeVisible();
};

export default {
  reloadApp,
  getQuestionTab,
  getLessonTab,
  getClueTab,
  getContextTab,
  bypassAuthentication
};
