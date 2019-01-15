// @flow

import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';

import type {State as ProgressionState} from './reducers/progression';
import progression from './reducers/progression';
import type {State as NavigationState} from './reducers/navigation';
import navigation from './reducers/navigation';

export type StoreState = {|
  progression: ProgressionState,
  navigation: NavigationState
|};

const rootReducer = combineReducers({
  progression,
  navigation
});

const middlewares = [thunk];

const store = createStore(rootReducer, applyMiddleware(...middlewares));

export default store;
