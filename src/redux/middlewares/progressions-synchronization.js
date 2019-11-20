// @flow

import type {Middleware, Dispatch} from 'redux';

import {PROGRESSION_CREATE_SUCCESS} from '@coorpacademy/player-store';
import type {Options, StoreAction} from '../_types';
import type {StoreState} from '../store';
import {NAVIGATION_SCREEN_CHANGE} from '../actions/navigation';
import type {Action as NavigationAction} from '../actions/navigation';
import type {Action as ProgressionAction} from '../actions/progressions/synchronize';
import {synchronizeProgressions} from '../actions/progressions/synchronize';
import {getToken, getBrand} from '../utils/state-extract';
import {FETCH_SUCCESS as FETCH_SECTIONS_SUCCESS} from '../actions/catalog/sections';

type Action = NavigationAction | ProgressionAction;
type State = StoreState;

const createMiddleware = ({
  services
}: Options): // $FlowFixMe
Middleware<State, StoreAction<Action>, Dispatch<StoreAction<Action>>> => ({
  dispatch,
  getState
}) => next => action => {
  const state = getState();
  const token = getToken(state);
  const brand = getBrand(state);

  if (token && brand) {
    if (
      (action.type === NAVIGATION_SCREEN_CHANGE && action.payload.currentScreenName === 'Home') ||
      action.type === PROGRESSION_CREATE_SUCCESS ||
      action.type === FETCH_SECTIONS_SUCCESS
    ) {
      dispatch(synchronizeProgressions);
    }
    return next(action);
  }

  return next(action);
};

export default createMiddleware;
