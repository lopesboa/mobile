// @flow strict

import {isFastSlideEnabled, isGodModeUser} from '../utils/state-extract';
import type {StoreAction} from '../_types';

export const TOGGLE = '@@fast-slide/TOGGLE';

export type Action = {|
  type: '@@fast-slide/TOGGLE',
  payload: boolean
|};

export const toggle = (): StoreAction<Action> => (dispatch: Dispatch, getState: GetState) => {
  const state = getState();

  if (!isGodModeUser(state)) {
    return Promise.resolve();
  }

  return dispatch({
    type: TOGGLE,
    payload: !isFastSlideEnabled(state)
  });
};
