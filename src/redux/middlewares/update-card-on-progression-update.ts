import type {Middleware, Dispatch} from 'redux';
import {PROGRESSION_UPDATED_ON_MOVE, PROGRESSION_UPDATED_ON_NODE} from '@coorpacademy/player-store';

import type {Options, StoreAction} from '../_types';
import type {StoreState} from '../store';
import {getAndRefreshCard} from '../actions/catalog/cards/refresh';

type Action = {};
type State = StoreState;

const createMiddleware = ({
  services,
}: Options): // @ts-ignore
Middleware<State, StoreAction<Action>, Dispatch<StoreAction<Action>>> => ({dispatch, getState}) => (
  next,
) => (action) => {
  if ([PROGRESSION_UPDATED_ON_MOVE, PROGRESSION_UPDATED_ON_NODE].includes(action.type)) {
    dispatch(getAndRefreshCard(action.meta.id));
  }

  return next(action);
};

export default createMiddleware;
