// @flow

import * as React from 'react';
import {Provider} from 'react-redux';

import {createProgression} from '../__fixtures__/progression';
import {createStoreState} from '../__fixtures__/store';
import createDataLayer from '../layer/data';
import createServices from '../services';
import createStore from '../redux';
import {__TEST__} from '../modules/environment';
import BrandThemeProvider from '../components/brand-theme-provider';
import UserProvider from '../components/user-provider';
import {ENGINE, CONTENT_TYPE} from '../const';
import type {Layout} from '../containers/with-layout';
import {VIBRATION_TYPE} from '../containers/with-vibration';
import type {Vibration} from '../containers/with-vibration';
import {AUDIO_FILE} from '../containers/with-audio';
import type {Audio} from '../containers/with-audio';
import type {State as AnalyticsState} from '../components/analytics-provider';

export const createFakeStore = <S>(state?: S) => ({
  ...createStore(createServices(createDataLayer())),
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
          ref: 'mod_foo'
        }
      })
    }),
    ...state
  })
});

// export const store = createStore(createServices(createDataLayer()));

// eslint-disable-next-line no-console
export const handleFakePress = () => console.log('Fake press');

// eslint-disable-next-line flowtype/no-weak-types
type TestContextProviderProps<S> = {|
  store?: S,
  children: React.Node
|};
export const TestContextProvider = <S>({store, children}: TestContextProviderProps<S>) => {
  return (
    <Provider store={createFakeStore<S>(store)}>
      <UserProvider>
        <BrandThemeProvider>{children}</BrandThemeProvider>
      </UserProvider>
    </Provider>
  );
};

export const fakeError = new Error('Fake error');

export const sleep = (duration: number = 10): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, duration));

export const fakeLayout: Layout = {width: 320, height: 768};

export const createFakeAnalytics = (): AnalyticsState => ({
  logEvent: __TEST__ ? jest.fn() : () => {}
});

export const createFakeVibration = (): Vibration => ({
  VIBRATION_TYPE,
  vibrate: __TEST__ ? jest.fn() : () => {}
});

export const createFakeAudio = (): Audio => ({
  AUDIO_FILE,
  play: __TEST__ ? jest.fn() : () => {}
});
