import {combineReducers} from 'redux';
import type {Reducer} from 'redux';
import type {Action as AuthenticationAction} from '../../actions/authentication';
import type {Action as BrandAction} from '../../actions/brands';
import type {Action as UserAction} from '../../actions/user';
import userReducer from './user';
import type {State as UserState} from './user';
import brandReducer from './brand';
import type {State as BrandState} from './brand';
import tokenReducer from './token';
import type {State as TokenState} from './token';

export type State = {
  token: TokenState;
  user: UserState;
  brand: BrandState;
};

const reducers: Reducer<State, BrandAction | AuthenticationAction | UserAction> = combineReducers({
  brand: brandReducer,
  user: userReducer,
  token: tokenReducer,
});
export default reducers;
