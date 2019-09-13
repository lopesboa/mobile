// @flow strict

import {isGodModeEnabled, isGodModeUser} from '../utils/state-extract';
import type {StoreAction} from '../_types';

export const TOGGLE = '@@god-mode/TOGGLE';

export type Action = {|
  type: '@@god-mode/TOGGLE',
  payload: boolean
|};

export const toggle = (): StoreAction<Action> => (dispatch: Dispatch, getState: GetState) => {
  const state = getState();

  if (!isGodModeUser(state)) {
    return Promise.resolve();
  }

  return dispatch({
    type: TOGGLE,
    payload: !isGodModeEnabled(state)
  });
};
