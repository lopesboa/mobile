// @flow strict

import {combineReducers} from 'redux';
import tokenReducer from './token';
import type {State as TokenState} from './token';
import brandReducer from './brand';
import type {State as BrandState} from './brand';

export type State = {|
  token: TokenState,
  brand: BrandState
|};

export default combineReducers({brand: brandReducer, token: tokenReducer});
