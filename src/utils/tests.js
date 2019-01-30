// @flow

import * as React from 'react';
import {Provider} from 'react-redux';

import store from '../redux';

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
