// @flow

let alreadyLaunched = false;

const reloadApp = async () => {
  // @todo use reloadReactNative(); once it's working in Android
  await device.launchApp({newInstance: !alreadyLaunched});

  if (!alreadyLaunched) {
    alreadyLaunched = true;
  }
};

const getContextTab = el => el(by.id('slide-tab')).atIndex(3);
const getQuestionTab = el => el(by.id('slide-tab')).atIndex(2);
const getLessonTab = el => el(by.id('slide-tab')).atIndex(1);
const getClueTab = el => el(by.id('slide-tab')).atIndex(0);

export default {
  reloadApp,
  getQuestionTab,
  getLessonTab,
  getClueTab,
  getContextTab
};
