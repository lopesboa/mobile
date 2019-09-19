// @flow

import * as React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

import {createFakeVibration} from '../../utils/tests';

const withVibration = <P>(WrappedComponent: React$ComponentType<P>) => {
  const ComponentWithVibration = props => (
    <WrappedComponent {...props} vibration={createFakeVibration()} />
  );

  return hoistNonReactStatic(ComponentWithVibration, WrappedComponent);
};

export default withVibration;
