// @flow

import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';

import type {State as ProgressionState} from './reducers/progression';
import progression from './reducers/progression';

export type StoreState = {|
  progression: ProgressionState
|};

const rootReducer = combineReducers({
  progression
});

const middlewares = [thunk];

const store = createStore(rootReducer, applyMiddleware(...middlewares));

export default store;
