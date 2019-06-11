// @flow strict

import {combineReducers} from 'redux';
import type {Reducer} from 'redux';
import type {Action} from '../../actions/authentication';
import type {Action as BrandAction} from '../../actions/brands';
import tokenReducer from './token';
import type {State as TokenState} from './token';
import brandReducer from './brand';
import type {State as BrandState} from './brand';

export type State = {|
  user: TokenState,
  brand: BrandState
|};

const reducers: Reducer<State, BrandAction | Action> = combineReducers({
  brand: brandReducer,
  user: tokenReducer
});
export default reducers;
