// @flow

import {NativeModules, Platform, ScrollView, Vibration} from 'react-native';
import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock';

// AsyncStorage
jest.mock('@react-native-community/async-storage', () => mockAsyncStorage);

// Fetch
jest.mock('cross-fetch');

// react-native mocks
ScrollView.propTypes = {
  decelerationRate: () => {}
};

Vibration.vibrate = () => {};
Vibration.cancel = () => {};

jest.mock('NativeEventEmitter', () => {
  return class MockNativeEventEmitter {
    addListener = () => ({remove: jest.fn()});

    removeListener = () => jest.fn();

    removeAllListeners = () => jest.fn();
  };
});

// react-native Linking
NativeModules.Linking = {
  addEventListener: () => {},
  removeEventListener: () => {},
  openURL: () => {},
  canOpenURL: () => {},
  getInitialURL: () => {}
};

// react-native-localization
NativeModules.ReactLocalization = {
  language: 'en-US'
};

// react-native-device-info
jest.mock('react-native-device-info', () => ({
  getBrand: jest.fn(() => Promise.resolve('Apple')),
  getModel: jest.fn(() => Promise.resolve('iPhone')),
  getSystemVersion: jest.fn(() => Promise.resolve('12.2'))
}));

// react-native Platform
Platform.OS = 'ios';

// react-native-video-controls
jest.mock('react-native-video', () => ({
  __esModule: true,
  default: 'Mock$ReactNativeVideo',
  TextTrackType: {
    VTT: 'text/vtt'
  }
}));

// react-native-splash-screen
jest.mock('react-native-splash-screen', () => ({
  __esModule: true,
  default: {
    hide: jest.fn(() => Promise.resolve())
  }
}));

// react-native-pdf
jest.mock('rn-fetch-blob', () => ({
  DocumentDir: () => {},
  fetch: () => {},
  base64: () => {},
  android: () => {},
  ios: () => {},
  config: () => {},
  session: () => {},
  fs: {
    dirs: {
      MainBundleDir: () => {},
      CacheDir: () => {},
      DocumentDir: () => {}
    }
  },
  wrap: () => {},
  polyfill: () => {},
  JSONStream: () => {}
}));

NativeModules.PdfViewManager = {
  supportPDFKit: callback => callback(false)
};

// react-native-camera

jest.mock('react-native-camera', () => ({
  __esModule: true,
  default: 'Mock$ReactNativeCamera'
}));

// react-native-permissions

jest.mock('react-native-permissions', () => {
  const {PERMISSION_STATUS} = require('./src/const');

  return {
    canOpenSettings: jest.fn(() => Promise.resolve(true)),
    openSettings: jest.fn(() => Promise.resolve(undefined)),
    request: jest.fn(() => Promise.resolve(PERMISSION_STATUS.UNDETERMINED)),
    check: jest.fn(() => Promise.resolve(PERMISSION_STATUS.UNDETERMINED))
  };
});

// react-native-snap-carousel

jest.mock('react-native-snap-carousel', () => ({
  Pagination: 'Mock$ReactNativeSnapCarousel$Pagination'
}));

// react-navigation

jest.mock('react-navigation', () => ({
  SafeAreaView: 'Mock$ReactNavigation$SafeAreaView',
  NavigationEvents: 'Mock$ReactNavigation$NavigationEvents',
  NavigationActions: {
    back: () => 'Mock$ReactNavigation$NavigationActions$Back'
  }
}));

// react-native-confetti-cannon

jest.mock('@coorpacademy/react-native-confetti-cannon', () => 'Mock$ReactNativeConfettiCannon');

// react-native-firebase

jest.mock('react-native-firebase', () => ({
  analytics: () => ({
    setAnalyticsCollectionEnabled: jest.fn(),
    logEvent: jest.fn(),
    setCurrentScreen: jest.fn(),
    setUserProperty: jest.fn(),
    setUserProperties: jest.fn()
  }),
  utils: jest.fn(() => ({}))
}));

// react-native-status-bar-height

jest.mock('react-native-status-bar-height', () => ({
  getStatusBarHeight: jest.fn(() => 0)
}));

// ./src/containers/with-layout

jest.mock('./src/containers/with-layout');

// ./src/containers/with-audio

jest.mock('./src/containers/with-audio');

// ./src/containers/with-vibration

jest.mock('./src/containers/with-vibration');

// react-native-email-link

jest.mock('react-native-email-link', () => ({
  openInbox: jest.fn(() => {})
}));

// react-native-sound

jest.mock('react-native-sound', () => ({
  __esModule: true,
  default: class {
    static IsAndroid = true;

    static setCategory = jest.fn();

    play = jest.fn();

    release = jest.fn();
  }
}));

// react-native-haptic-feedback

jest.mock('react-native-haptic-feedback', () => ({
  trigger: jest.fn()
}));

// react-native-flash-message

jest.mock('react-native-flash-message', () => ({
  __esModule: true,
  default: 'Mock$ReactNativeFlashMessage',
  showMessage: jest.fn(),
  hideMessage: jest.fn()
}));

// react-native-orientation-locker

jest.mock('react-native-orientation-locker', () => ({
  unlockAllOrientations: jest.fn(),
  lockToPortrait: jest.fn()
}));
