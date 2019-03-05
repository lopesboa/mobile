// @flow

import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import {middlewares, reducers as storeReducers} from '@coorpacademy/player-store';
import type {ReduxState} from '@coorpacademy/player-store';

import type {State as NavigationState} from './reducers/navigation';
import navigation from './reducers/navigation';
import type {State as DisciplineBundleState} from './reducers/discipline-bundle';
import type {State as CardsState} from './reducers/cards';
import type {State as BrandsState} from './reducers/brands';
import disciplineBundle from './reducers/discipline-bundle';
import cards from './reducers/cards';
import brands from './reducers/brands';
import DisciplineBundle from './middlewares/discipline-bundle';
import Cards from './middlewares/cards';
import Brands from './middlewares/brands';
import type {Options, ReduxDevTools} from './_types';

export type StoreState = $Exact<{|
  ...$Exact<ReduxState>,
  navigation: NavigationState,
  disciplineBundle: DisciplineBundleState,
  cards: CardsState,
  brands: BrandsState
|}>;

const {ErrorLogger, ReduxThunkMemoized} = middlewares;
const {data, ui} = storeReducers;

const reducers = combineReducers({
  data,
  ui,
  navigation,
  disciplineBundle,
  cards,
  brands
});

const createMiddlewares = (options: Options, reduxDevTools?: ReduxDevTools) => {
  return compose(
    // $FlowFixMe error applying middlewares with multiple types
    applyMiddleware(
      ReduxThunkMemoized(options),
      ErrorLogger(options),
      DisciplineBundle(options),
      Cards(options),
      Brands(options)
    ),
    reduxDevTools || (f => f)
  );
};

const create = (options: Options, reduxDevTools?: ReduxDevTools) =>
  createStore(reducers, {}, createMiddlewares(options, reduxDevTools));

export default create;
