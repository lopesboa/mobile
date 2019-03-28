// @flow

import type {Middleware, Dispatch} from 'redux';

import {UI_PROGRESSION_ACTION_TYPES} from '@coorpacademy/player-store';
import type {Options, StoreAction} from '../_types';
import type {StoreState} from '../store';
import translationUtil from '../../translations';

import {getAndRefreshCard} from '../actions/cards';

type Action = {||};
type State = StoreState;

const createMiddleware = ({
  services
}: Options): // $FlowFixMe
Middleware<State, StoreAction<Action>, Dispatch<StoreAction<Action>>> => ({
  dispatch,
  getState
}) => next => action => {
  if (action.type === UI_PROGRESSION_ACTION_TYPES.PROGRESSION_UPDATED) {
    const language = translationUtil.getLanguage();
    dispatch(getAndRefreshCard(action.meta.id, language));
  }

  return next(action);
};

export default createMiddleware;
