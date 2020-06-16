import {NativeModules, Platform, ScrollView} from 'react-native';
import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock';

// AsyncStorage
jest.mock('@react-native-community/async-storage', () => mockAsyncStorage);

// Fetch
jest.mock('cross-fetch');

// react-native mocks
ScrollView.propTypes = {
  decelerationRate: () => {}
};

jest.mock('react-native-qrcode-scanner', () => ({
  __esModule: true,
  default: 'Mock$QRCodeScanner'
}));

jest.mock('react-native-localization', () => {
  // type Trads = {[key: SupportedLanguage]: Translations};
  return class LocalizedStrings {
    constructor(translations) {
      Object.keys(translations.en).forEach(key => {
        this[key] = translations.en[key];
      });
    }

    setLanguage = jest.fn();

    getLanguage = jest.fn(() => 'en');

    getInterfaceLanguage = jest.fn(() => 'en');

    formatString = jest.fn((str, ...replacers) => {
      let result = str;
      Object.keys(replacers).forEach(key => {
        result = result.replace('{' + key + '}', replacers[key]);
      });
      return result;
    });
  };
});

jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(),
  fetch: jest.fn(state => Promise.resolve(state))
}));

jest.mock('react-native-offline', () => ({
  NetworkProvider: jest.fn(),
  NetworkConsumer: jest.fn(),
  reducer: null,
  createNetworkMiddleware: jest.fn(),
  checkInternetConnection: jest.fn(),
  offlineActionTypes: {
    CONNECTION_CHANGE: '@@network-connectivity/CONNECTION_CHANGE'
  }
}));

jest.mock('react-native/Libraries/Vibration/NativeVibration.js', () => {
  return class MockVibration {
    vibrate = () => jest.fn();

    cancel = () => jest.fn();
  };
});

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter.js', () => {
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
  HeaderBackButton: 'Mock$ReactNavigation$HeaderBackButton',
  NavigationEvents: 'Mock$ReactNavigation$NavigationEvents',
  NavigationActions: {
    back: () => 'Mock$ReactNavigation$NavigationActions$Back'
  }
}));

// react-native-confetti-cannon

jest.mock('react-native-confetti-cannon', () => 'Mock$ReactNativeConfettiCannon');

// react-native-firebase

jest.mock('@react-native-firebase/crashlytics', () => jest.fn());
jest.mock('@react-native-firebase/analytics', () =>
  jest.fn(() => ({
    __esModule: true,
    setAnalyticsCollectionEnabled: jest.fn(),
    logEvent: jest.fn(),
    setCurrentScreen: jest.fn(),
    setUserProperty: jest.fn(),
    setUserProperties: jest.fn()
  }))
);

jest.mock('@react-native-firebase/app', () => ({
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
