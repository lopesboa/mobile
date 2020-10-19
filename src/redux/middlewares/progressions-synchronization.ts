import type {Middleware, Dispatch} from 'redux';
import {offlineActionTypes} from 'react-native-offline';

import {PROGRESSION_CREATE_SUCCESS} from '@coorpacademy/player-store';
import type {Options, StoreAction} from '../_types';
import type {StoreState} from '../store';
import type {Action as NavigationAction} from '../navigation';
import type {Action as ProgressionAction} from '../actions/progressions/synchronize';
import {synchronizeProgressions} from '../actions/progressions/synchronize';
import {FETCH_SUCCESS as FETCH_SECTIONS_SUCCESS} from '../actions/catalog/sections';

type Action = NavigationAction | ProgressionAction;
type State = StoreState;

const createMiddleware = ({
  services,
}: Options): // @ts-ignore
Middleware<State, StoreAction<Action>, Dispatch<StoreAction<Action>>> => ({dispatch, getState}) => (
  next,
) => (action) => {
  const {CONNECTION_CHANGE} = offlineActionTypes;

  if (
    [PROGRESSION_CREATE_SUCCESS, FETCH_SECTIONS_SUCCESS].includes(action.type) ||
    (action.type === CONNECTION_CHANGE && action.payload)
  ) {
    dispatch(synchronizeProgressions);
  }

  return next(action);
};

export default createMiddleware;
