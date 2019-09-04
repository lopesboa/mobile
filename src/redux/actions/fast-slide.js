// @flow strict

import {isFastSlideEnabled} from '../utils/state-extract';
import type {StoreAction} from '../_types';

export const TOGGLE = '@@fast-slide/TOGGLE';

export type Action = {|
  type: '@@fast-slide/TOGGLE',
  payload: boolean
|};

export const toggle = (): StoreAction<Action> => (dispatch: Dispatch, getState: GetState) => {
  const value = isFastSlideEnabled(getState());

  return dispatch({
    type: TOGGLE,
    payload: !value
  });
};
