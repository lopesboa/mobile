import {createReducer, createAction} from '@reduxjs/toolkit';
import {getAppSession} from '../utils/state-extract';

export type State = number;
export type ActionPayload = number;

export const ACTION_NAME = '@@app-session/SAVE_INCREMENT';
export const SAVE_INCREMENT = createAction<ActionPayload, typeof ACTION_NAME>(ACTION_NAME);

export type Action = {
  type: typeof ACTION_NAME;
  payload: ActionPayload;
};

const initialState: State = 0;

const appSessionReducer = createReducer(initialState, {
  [SAVE_INCREMENT.type]: (state, action) => action.payload,
});

export const increment = () => (dispatch, getState) => {
  const registredAppSession = getAppSession(getState());
  let appSession: number = registredAppSession !== null ? Number(registredAppSession) : 0;
  appSession = appSession + 1;

  return dispatch(SAVE_INCREMENT(appSession));
};

export default appSessionReducer;
