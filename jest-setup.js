// @flow

import {NativeModules, ScrollView} from 'react-native';

// global mocks
global.fetch = jest.fn().mockImplementation(() => Promise.resolve());

// react-native mocks
ScrollView.propTypes = {
  decelerationRate: () => {}
};

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
  language: 'en'
};

// react-native-video-controls
jest.mock('react-native-video', () => ({
  __esModule: true,
  default: 'Mock$ReactNativeVideo',
  TextTrackType: {
    VTT: 'text/vtt'
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
