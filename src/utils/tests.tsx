import * as React from 'react';
import {Provider} from 'react-redux';

import {createProgression} from '../__fixtures__/progression';
import {createStoreState} from '../__fixtures__/store';
import createDataLayer from '../layer/data';
import createServices, {Services} from '../services';

import createStore from '../redux';
import {__TEST__} from '../modules/environment';
import BrandThemeProvider from '../components/brand-theme-provider';
import UserProvider from '../components/user-provider';
import {ENGINE, CONTENT_TYPE} from '../const';
import {Layout} from '../containers/with-layout';
import {Vibration} from '../containers/with-vibration';
import {Audio} from '../containers/with-audio';
import {StoreState} from '../redux/store';

export const createFakeStore = (state: StoreState) => ({
  ...createStore(createServices(createDataLayer())).store,
  getState: () => ({
    ...createStoreState({
      levels: [],
      disciplines: [],
      chapters: [],
      slides: [],
      progression: createProgression({
        engine: ENGINE.MICROLEARNING,
        progressionContent: {
          type: CONTENT_TYPE.LEVEL,
          ref: 'mod_foo',
        },
      }),
    }),
    ...state,
  }),
});

// export const store = createStore(createServices(createDataLayer()));

// eslint-disable-next-line no-console
export const handleFakePress = () => console.log('Fake press');

interface TestContextProviderProps {
  store?: typeof createStore;
  children: React.ReactNode;
}

export const TestContextProvider = ({store, children}: TestContextProviderProps) => {
  return (
    <Provider store={createFakeStore(store)}>
      <UserProvider>
        <BrandThemeProvider>{children}</BrandThemeProvider>
      </UserProvider>
    </Provider>
  );
};

export const fakeError = new Error('Fake error');

export const sleep = (duration = 10): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, duration));

export const fakeLayout: Layout = {width: 320, height: 768};

export const createFakeAnalytics = (): Pick<Services, 'Analytics'> => {
  return {
    // @ts-ignore
    logEvent: __TEST__ ? jest.fn() : () => {},
  };
};

export const createFakeLogger = (): Pick<Services, 'Logger'> => ({
  // @ts-ignore
  error: jest.fn(),
  setProperties: jest.fn(),
});

export const createFakeVibration = (): Vibration => ({
  VIBRATION_TYPE: {
    SELECTION: 'selection',
    IMPACT_LIGHT: 'impactLight',
    IMPACT_MEDIUM: 'impactMedium',
    IMPACT_HEAVY: 'impactHeavy',
    NOTIFICATION_SUCCESS: 'notificationSuccess',
    NOTIFICATION_WARNING: 'notificationWarning',
    NOTIFICATION_ERROR: 'notificationError',
  },
  vibrate: __TEST__ ? jest.fn() : () => {},
});

export const createFakeAudio = (): Audio => ({
  AUDIO_FILE: {
    WRONG_ANSWER: undefined,
    GOOD_ANSWER: undefined,
    FAILURE_LEVEL: undefined,
    SUCCESS_LEVEL: undefined,
  },
  play: __TEST__ ? jest.fn() : () => {},
});

export const extractErrorName = async (promise: Promise<void>): Promise<string | void> => {
  try {
    await promise;
  } catch (error) {
    return error.name;
  }
  return;
};
