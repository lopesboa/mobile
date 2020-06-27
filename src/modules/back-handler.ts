import {BackHandler as BaseBackHandler} from 'react-native';
import {__TEST__} from './environment';

/* FOR TESTING PURPOSE ONLY */
const TestBackHandlerEvents = {};
export const TestBackHandler = (() => {
  if (__TEST__) {
    return {
      addEventListener: jest.fn((eventName, callback) => {
        TestBackHandlerEvents[eventName] = callback;
      }),
      removeEventListener: jest.fn((eventName, callback) => {
        TestBackHandlerEvents[eventName] = callback;
        delete TestBackHandlerEvents[eventName];
      }),
      exitApp: jest.fn(),
      fireEvent(eventName) {
        TestBackHandlerEvents[eventName]();
      }
    };
  }
})();

export const BackHandler = (() => {
  /* istanbul ignore next */
  if (!__TEST__) {
    return BaseBackHandler;
  }
  return TestBackHandler;
})();
