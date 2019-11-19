// @flow

import type {Middleware, MiddlewareAPI, Dispatch} from 'redux';

import type {StoreErrorAction} from '../_types';
import type {StoreState} from '../store';

import {ForbiddenError} from '../../models/error';
import {showError} from '../actions/ui/errors';
import {ERROR_TYPE} from '../../const';
import type {Action as ErrorAction} from '../actions/ui/errors';

type Action =
  | StoreErrorAction<{|
      type: string
    |}>
  | ErrorAction<void>;
type State = StoreState;

const createMiddleware = (): Middleware<State, Action, Dispatch<Action>> => ({
  dispatch,
  getState
}: MiddlewareAPI<State, Action, Dispatch<Action>>) => (
  next: Dispatch<Action>
): Dispatch<Action> => (action: Action) => {
  if (action.payload && action.payload instanceof ForbiddenError) {
    dispatch(
      showError({
        type: ERROR_TYPE.PLATFORM_NOT_ACTIVATED
      })
    );
  }

  return next(action);
};

export default createMiddleware;
