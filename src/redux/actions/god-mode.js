// @flow strict

import {isGodModeEnabled} from '../utils/state-extract';
import type {StoreAction} from '../_types';

export const TOGGLE = '@@god-mode/TOGGLE';

export type Action = {|
  type: '@@god-mode/TOGGLE',
  payload: boolean
|};

export const toggle = (): StoreAction<Action> => (dispatch: Dispatch, getState: GetState) => {
  const value = isGodModeEnabled(getState());

  return dispatch({
    type: TOGGLE,
    payload: !value
  });
};
