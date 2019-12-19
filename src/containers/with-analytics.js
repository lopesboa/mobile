// @flow

import * as React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

import type {Services} from '../services';
import createServices from '../services';
import createDataLayer from '../layer/data';

export type WithAnalyticsProps = {|
  analytics?: $PropertyType<Services, 'Analytics'>
|};

const dataLayer = createDataLayer();
const services = createServices(dataLayer);
const analytics = services.Analytics;

function withAnalytics<P>(
  WrappedComponent: React$ComponentType<P>
): React$ComponentType<$Exact<{|...WithAnalyticsProps, ...P|}>> {
  type Props = $Exact<{|
    ...P,
    ...WithAnalyticsProps
  |}>;

  const ComponentWithAnalytics = (props: Props) => (
    <WrappedComponent {...props} analytics={analytics} />
  );

  return hoistNonReactStatic(ComponentWithAnalytics, WrappedComponent);
}

export default withAnalytics;
