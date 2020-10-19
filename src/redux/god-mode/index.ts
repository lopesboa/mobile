import {createReducer, createAction} from '@reduxjs/toolkit';
import {isGodModeEnabled, isGodModeUser} from '../utils/state-extract';

export type State = boolean;
export type ActionPayload = boolean;

export const ACTION_NAME = '@@god-mode/TOGGLE';
export const TOGGLE = createAction<ActionPayload, typeof ACTION_NAME>(ACTION_NAME);

export type Action = {
  type: typeof ACTION_NAME;
  payload: ActionPayload;
};

const initialState: State = false;

const godModeReducer = createReducer(initialState, {
  [TOGGLE.type]: (state, action) => action.payload,
});

export const toggle = () => (dispatch, getState) => {
  const state = getState();
  if (!isGodModeUser(state)) {
    return false;
  }
  const action = TOGGLE(!isGodModeEnabled(state));
  return dispatch(action);
};

export default godModeReducer;
