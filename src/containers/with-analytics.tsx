import * as React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

import type {Services} from '../services';
import createServices from '../services';
import createDataLayer from '../layer/data';

export interface WithAnalyticsProps {
  analytics?: Pick<Services, 'Analytics'>;
}

const dataLayer = createDataLayer();
const services = createServices(dataLayer);
const analytics = services.Analytics;

function withAnalytics(WrappedComponent: React.ElementType<any>) {
  type Props = WithAnalyticsProps;

  const ComponentWithAnalytics = (props: Props) => (
    <WrappedComponent {...props} analytics={analytics} />
  );

  return hoistNonReactStatic(ComponentWithAnalytics, WrappedComponent);
}

export default withAnalytics;
