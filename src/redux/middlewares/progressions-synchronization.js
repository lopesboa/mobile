// @flow

import type {Middleware, Dispatch} from 'redux';

import type {Options, StoreAction} from '../_types';
import type {StoreState} from '../store';
import {NAVIGATION_SCREEN_CHANGE} from '../actions/navigation';
import type {Action as NavigationAction} from '../actions/navigation';
import type {Action as ProgressionAction} from '../actions/progressions/synchronize';
import {synchronizeProgressions} from '../actions/progressions/synchronize';

type Action = NavigationAction | ProgressionAction;
type State = StoreState;

const createMiddleware = ({
  services
}: Options): // $FlowFixMe
Middleware<State, StoreAction<Action>, Dispatch<StoreAction<Action>>> => ({
  dispatch,
  getState
}) => next => action => {
  if (action.type === NAVIGATION_SCREEN_CHANGE && action.payload.currentScreenName === 'Home') {
    dispatch(synchronizeProgressions);
  }

  return next(action);
};

export default createMiddleware;
