// @flow

import createDataLayer from '../layer/data';
import createServices from '../services';
import translationsUtils from '../translations';
import createStore from './store';
import type {Options, ReduxDevTools} from './_types';

const options: Options = {
  services: createServices(createDataLayer(translationsUtils.getLanguage()))
};

const create = (reduxDevTools?: ReduxDevTools) => createStore(options, reduxDevTools);
export default create;
