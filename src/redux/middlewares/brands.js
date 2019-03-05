// @flow

import type {Middleware, MiddlewareAPI, Dispatch} from 'redux';

import type {Options} from '../_types';
import type {StoreState} from '../store';
import {FETCH_REQUEST, fetchSuccess, fetchError} from '../actions/brands';
import type {Action} from '../actions/brands';
import type {Brand} from '../../types';

type State = StoreState;

const createMiddleware = ({services}: Options): Middleware<State, Action, Dispatch<Action>> => ({
  dispatch
}: MiddlewareAPI<State, Action, Dispatch<Action>>) => (
  next: Dispatch<Action>
): Dispatch<Action> => (action: Action) => {
  if (action.type === FETCH_REQUEST) {
    const {token} = action.payload;
    services.Brands.find(token)
      .then((brand: Brand) => dispatch(fetchSuccess(brand, token)))
      .catch(e => {
        dispatch(fetchError(e.toString()));
      });
  }
  return next(action);
};

export default createMiddleware;
