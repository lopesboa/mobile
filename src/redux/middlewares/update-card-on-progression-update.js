// @flow

import type {Middleware, Dispatch} from 'redux';
import {PROGRESSION_UPDATED_ON_MOVE, PROGRESSION_UPDATED_ON_NODE} from '@coorpacademy/player-store';

import type {Options, StoreAction} from '../_types';
import type {StoreState} from '../store';
import translationUtil from '../../translations';
import {getAndRefreshCard} from '../actions/catalog/cards/refresh';

type Action = {||};
type State = StoreState;

const createMiddleware = ({
  services
}: Options): // $FlowFixMe
Middleware<State, StoreAction<Action>, Dispatch<StoreAction<Action>>> => ({
  dispatch,
  getState
}) => next => action => {
  if ([PROGRESSION_UPDATED_ON_MOVE, PROGRESSION_UPDATED_ON_NODE].includes(action.type)) {
    const language = translationUtil.getLanguage();
    dispatch(getAndRefreshCard(action.meta.id, language));
  }

  return next(action);
};

export default createMiddleware;
