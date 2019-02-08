// @flow

import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import {middlewares, reducers as storeReducers} from '@coorpacademy/player-store';

import type {State as NavigationState} from './reducers/navigation';
import navigation from './reducers/navigation';
import type {Options, ReduxDevTools} from './_types';

export type StoreState = {|
  data: any, // eslint-disable-line flowtype/no-weak-types, @todo type reducers store-side
  ui: any, // eslint-disable-line flowtype/no-weak-types, @todo type reducers store-side
  navigation: NavigationState
|};

const {ErrorLogger, ReduxThunkMemoized} = middlewares;
const {data, ui} = storeReducers;

const reducers = combineReducers({
  data,
  ui,
  navigation
});

const createMiddlewares = (options: Options, reduxDevTools?: ReduxDevTools) => {
  return compose(
    applyMiddleware(ReduxThunkMemoized(options), ErrorLogger(options)),
    reduxDevTools || (f => f)
  );
};

const create = (options: Options, reduxDevTools?: ReduxDevTools) =>
  createStore(reducers, {}, createMiddlewares(options, reduxDevTools));

export default create;
