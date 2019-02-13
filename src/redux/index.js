// @flow

import createDataLayer from '../layer/data';
import createServices from '../services';
import createStore from './store';
import type {Options, ReduxDevTools} from './_types';

const options: Options = {
  // @todo use OS locale
  services: createServices(createDataLayer('fr'))
};

const create = (reduxDevTools?: ReduxDevTools) => createStore(options, reduxDevTools);
export default create;
