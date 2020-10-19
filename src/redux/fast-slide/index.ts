import {createReducer, createAction} from '@reduxjs/toolkit';
import {isFastSlideEnabled, isGodModeUser} from '../utils/state-extract';

export type State = boolean;
export type ActionPayload = boolean;

export const ACTION_NAME = '@@fast-slide/TOGGLE';
export const TOGGLE = createAction<ActionPayload, typeof ACTION_NAME>(ACTION_NAME);

export type Action = {
  type: typeof ACTION_NAME;
  payload: ActionPayload;
};

const initialState: State = false;

const fastSlideReducer = createReducer(initialState, {
  [TOGGLE.type]: (state, action) => action.payload,
});

export const toggle = () => (dispatch, getState) => {
  const state = getState();
  if (!isGodModeUser(state)) {
    return false;
  }

  const action = TOGGLE(!isFastSlideEnabled(state));
  return dispatch(action);
};

export default fastSlideReducer;
