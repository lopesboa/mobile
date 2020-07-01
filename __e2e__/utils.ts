import {by, expect, element, waitFor, device} from 'detox';
import {HEIGHT as HERO_HEIGHT} from '../src/components/hero';
import {ITEM_WIDTH, ITEM_HEIGHT} from '../src/components/catalog-items';

let alreadyLaunched = false;

const defaultPermissions: Detox.DevicePermissions = {
  camera: 'YES',
  microphone: 'YES',
};

const getDevicePixelPerPoint = (): number => 2;

const getDeviceDimensions = (): {width: number; height: number} => ({
  width: 750 / getDevicePixelPerPoint(),
  height: 1334 / getDevicePixelPerPoint(),
});

export const reloadApp = async (
  additionalPermissions: Detox.DevicePermissions = defaultPermissions || {},
  newInstance = false,
) => {
  const permissions: Detox.DevicePermissions = {
    ...defaultPermissions,
    ...additionalPermissions,
  };
  // @todo use reloadReactNative(); once it's working in Android
  await device.launchApp({
    newInstance: !alreadyLaunched || newInstance,
    permissions,
  });

  if (!alreadyLaunched) {
    alreadyLaunched = true;
  }
};

export const getContextTab = (el: Detox.Element) => el(by.id('slide-tab')).atIndex(3);
export const getQuestionTab = (el: Detox.Element) => el(by.id('slide-tab')).atIndex(2);
export const getLessonTab = (el: Detox.Element) => el(by.id('slide-tab')).atIndex(1);
export const getClueTab = (el: Detox.Element) => el(by.id('slide-tab')).atIndex(0);

export const waitForExist = async (testID: string, useText = false) => {
  const getter = useText ? by.text : by.id;
  const el = element(getter(testID));

  await waitFor(el).toExist().withTimeout(1000);
  await expect(el).toExist();
};

export const waitForVisible = async (testID: string) => {
  const el = element(by.id(testID));
  await waitFor(el).toBeVisible().withTimeout(1000);
  await expect(el).toBeVisible();
};

export const waitForNotVisible = async (testID: string) => {
  const el = element(by.id(testID));
  await waitFor(el).toBeNotVisible().withTimeout(4000);
  await expect(el).toBeNotVisible();
};

export const tap = async (testID: string) => {
  await waitForExist(testID);
  await element(by.id(testID)).tap();
};

const getCardOffset = (index: number, numColumns?: number): {x: number; y: number} => {
  const {width} = getDeviceDimensions();

  if (numColumns) {
    const paddingLeft = (width - numColumns * ITEM_WIDTH) / 2;

    return {
      x: paddingLeft + ITEM_WIDTH * ((index - 1) % numColumns),
      y: ITEM_HEIGHT * parseInt(String((index - 1) / numColumns), 10) + 1, // Scroll amount must be positive and greater than zero
    };
  }

  return {
    x: ITEM_WIDTH * (index - 1) + 1, // Scroll amount must be positive and greater than zero
    y: 0,
  };
};

export const tapCardOnList = async (testID: string, index: number, isVertical?: boolean) => {
  const {width} = getDeviceDimensions();
  const numColumns = isVertical ? parseInt(String(width / ITEM_WIDTH), 10) : undefined;
  const {x, y} = getCardOffset(index, numColumns);

  await waitForExist(testID);

  if (isVertical) {
    await element(by.id(testID)).scrollTo('top');
    await element(by.id(testID)).scroll(y, 'down');
  } else {
    await element(by.id(testID)).scrollTo('left');
    await element(by.id(testID)).scroll(x, 'right');
  }

  await element(by.id(testID)).tapAtPoint({
    x: x + ITEM_WIDTH / 2,
    y: y + ITEM_HEIGHT / 2,
  });
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
  bypassAuthentication,
};
