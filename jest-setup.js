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
jest.mock('react-native-video', () => 'Mock$ReactNativeVideo');
