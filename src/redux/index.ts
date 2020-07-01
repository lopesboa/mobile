import type {Services} from '../services';
import createStore from './store';
import type {Options, ReduxDevTools} from './_types';

const create = (services: Services, reduxDevTools?: ReduxDevTools) => {
  const options: Options = {
    services,
  };

  return createStore(options, reduxDevTools);
};

export default create;
