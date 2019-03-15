// @flow

let alreadyLaunched = false;

const defaultPermissions: DetoxDevicePermissionsType = {
  camera: 'YES'
};

const reloadApp = async (
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

const getContextTab = (el: DetoxElement) => el(by.id('slide-tab')).atIndex(3);
const getQuestionTab = (el: DetoxElement) => el(by.id('slide-tab')).atIndex(2);
const getLessonTab = (el: DetoxElement) => el(by.id('slide-tab')).atIndex(1);
const getClueTab = (el: DetoxElement) => el(by.id('slide-tab')).atIndex(0);

const bypassAuthentication = async () => {
  await waitFor(element(by.id('authentication-screen'))).toBeVisible();
  await waitFor(element(by.id('scan-qr-code'))).toBeVisible();
  await element(by.id('scan-qr-code')).tap();
  await waitFor(element(by.id('qr-code-screen'))).toBeVisible();
  await weExpect(element(by.id('qr-code-screen'))).toBeVisible();
  await element(by.id('qr-code-screen')).longPress();
  await weExpect(element(by.id('home-screen'))).toBeVisible();
};

const checkResetAuthentication = () => {
  describe('Reset authentication', () => {
    beforeAll(async () => {
      // to empty async storage
      await device.launchApp({delete: true});
    });

    it('should see authentication screen', async () => {
      await waitFor(element(by.id('authentication-screen'))).toBeVisible();
      await waitFor(element(by.id('scan-qr-code'))).toBeVisible();
    });
  });
};

export default {
  reloadApp,
  getQuestionTab,
  getLessonTab,
  getClueTab,
  getContextTab,
  bypassAuthentication,
  checkResetAuthentication
};
