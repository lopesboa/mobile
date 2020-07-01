import * as React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

import {fakeLayout} from '../../utils/tests';

const withLayout = (WrappedComponent: React.ElementType<any>) => {
  const ComponentWithLayout = (props) => <WrappedComponent {...props} layout={fakeLayout} />;

  return hoistNonReactStatic(ComponentWithLayout, WrappedComponent);
};

export default withLayout;
