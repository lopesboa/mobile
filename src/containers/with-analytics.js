// @flow

import * as React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

import {AnalyticsContext} from '../components/analytics-provider';
import type {State as AnalyticsState} from '../components/analytics-provider';

export type WithAnalyticsProps = {|
  analytics?: AnalyticsState
|};

function withAnalytics<P>(
  WrappedComponent: React$ComponentType<P>
): React$ComponentType<$Exact<{|...WithAnalyticsProps, ...P|}>> {
  type Props = $Exact<{|
    ...P,
    ...WithAnalyticsProps
  |}>;

  const ComponentWithAnalytics = (props: Props) => {
    const analytics = React.useContext(AnalyticsContext);
    return <WrappedComponent {...props} analytics={analytics} />;
  };
  return hoistNonReactStatic(ComponentWithAnalytics, WrappedComponent);
}

export default withAnalytics;
