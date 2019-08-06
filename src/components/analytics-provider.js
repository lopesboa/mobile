// @flow

import * as React from 'react';

import type {Services} from '../services';
import createServices from '../services';
import createDataLayer from '../layer/data';

const dataLayer = createDataLayer();
const services = createServices(dataLayer);

type Props = {|
  children: React.Node
|};

export type State = $PropertyType<Services, 'Analytics'>;

const initialState: State = services.Analytics;

export const AnalyticsContext: React.Context<State> = React.createContext(initialState);

const AnalyticsProvider = ({children}: Props) => (
  <AnalyticsContext.Provider value={initialState}>{children}</AnalyticsContext.Provider>
);

export default AnalyticsProvider;
