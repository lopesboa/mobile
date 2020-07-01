import * as React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

import {createFakeAudio} from '../../utils/tests';

const withAudio = (WrappedComponent: React.ElementType<any>) => {
  const ComponentWithAudio = (props) => <WrappedComponent {...props} audio={createFakeAudio()} />;

  return hoistNonReactStatic(ComponentWithAudio, WrappedComponent);
};

export default withAudio;
