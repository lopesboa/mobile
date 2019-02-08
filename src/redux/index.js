// @flow

import createDataLayer from '../layer/data';
import createStore from './store';
import createServices from './services';
import type {Options, ReduxDevTools} from './_types';

const dataLayer = createDataLayer('fr');
const services = createServices(dataLayer);
const options: Options = {
  services
};

const create = (reduxDevTools?: ReduxDevTools) => createStore(options, reduxDevTools);
export default create;
