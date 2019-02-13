// @flow

import * as React from 'react';
import {Provider} from 'react-redux';

import createStore from '../redux';

export const store = createStore();

/* eslint-disable import/prefer-default-export */
// eslint-disable-next-line no-console
export const handleFakePress = () => console.log('Fake press');

// eslint-disable-next-line flowtype/no-weak-types
type TestContextProviderProps = {|
  children: React.Node
|};
export const TestContextProvider = (props: TestContextProviderProps) => (
  <Provider store={store}>{props.children}</Provider>
);

export const fakeError = new Error('Fake error');

export const sleep = (duration: number = 10) =>
  new Promise(resolve => setTimeout(resolve, duration));
