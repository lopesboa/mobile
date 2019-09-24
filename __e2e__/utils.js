// @flow strict

import {HEIGHT as HERO_HEIGHT} from '../src/components/hero';
import {ITEM_WIDTH, ITEM_HEIGHT} from '../src/components/catalog-section';

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

export const waitForExist = async (testID: string, useText: boolean = false) => {
  const getter = useText ? by.text : by.id;
  const el = element(getter(testID));

  // eslint-disable-next-line no-undef
  await waitFor(el)
    .toExist()
    .withTimeout(3000);
  await weExpect(el).toExist();
};

export const waitForVisible = async (testID: string) => {
  const el = element(by.id(testID));
  // eslint-disable-next-line no-undef
  await waitFor(el)
    .toBeVisible()
    .withTimeout(3000);
  await weExpect(el).toBeVisible();
};

export const waitForNotVisible = async (testID: string) => {
  const el = element(by.id(testID));
  // eslint-disable-next-line no-undef
  await waitFor(el)
    .toBeNotVisible()
    .withTimeout(10000);
  await weExpect(el).toBeNotVisible();
};

export const tap = async (testID: string) => {
  await waitForExist(testID);
  await element(by.id(testID)).tap();
};

// export const wait = (time: number) => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve();
//     }, time);
//   });
// };

export const tapCardOnSection = async (testID: string, index: number) => {
  const offsetX = ITEM_WIDTH * (index - 1) + 1; // Scroll amount must be positive and greater than zero
  await waitForExist(testID);
  await element(by.id(testID)).scrollTo('left');
  await element(by.id(testID)).scroll(offsetX, 'right');
  await element(by.id(testID)).tapAtPoint({x: offsetX + ITEM_HEIGHT / 2, y: ITEM_WIDTH / 2});
};

export const longPress = async (testID: string) => {
  await waitForVisible(testID);
  await element(by.id(testID)).longPress();
};

export const bypassAuthentication = async () => {
  await tap('button-sign-in-desktop');
  await tap('authentication-details-qr-code-button');
  await waitForExist('qr-code-scanner');
  await longPress('qr-code-screen');
  await waitForExist('home');
};

export const wrongAnswer = async () => {
  await element(by.id('question-screen')).swipe('up');
  await element(by.id('question-choice-1')).tap();
  await element(by.id('button-validate')).tap();
};

export const scrollHero = async () => {
  await element(by.id('catalog')).scroll(HERO_HEIGHT, 'down');
};

export default {
  reloadApp,
  getQuestionTab,
  getLessonTab,
  getClueTab,
  getContextTab,
  bypassAuthentication
};
