// @flow

import type {Middleware, MiddlewareAPI, Dispatch} from 'redux';

import {unselectProgression} from '@coorpacademy/player-store';
import type {SelectAction} from '@coorpacademy/player-store';
import type {Options} from '../_types';
import type {StoreState} from '../store';
import {NAVIGATION_SCREEN_CHANGE} from '../actions/navigation';
import type {Action as NavigationAction} from '../actions/navigation';

type Action = NavigationAction | SelectAction;
type State = StoreState;

const createMiddleware = ({services}: Options): Middleware<State, Action, Dispatch<Action>> => ({
  dispatch,
  getState
}: MiddlewareAPI<State, Action, Dispatch<Action>>) => (
  next: Dispatch<Action>
): Dispatch<Action> => (action: Action) => {
  if (action.type === NAVIGATION_SCREEN_CHANGE && action.payload.currentScreenName === 'Home') {
    dispatch(unselectProgression);
  }

  return next(action);
};

export default createMiddleware;
