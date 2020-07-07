import type {StoreAction} from '../_types';
import {getAppSession} from '../utils/state-extract';

export const SAVE_INCREMENT = '@@app-session/SAVE_INCREMENT';

export type Action = {
  type: '@@app-session/SAVE_INCREMENT',
  payload: number
};

export const increment = (): StoreAction<Action> => async (dispatch: Dispatch, getState: GetState) => {

  const registredAppSession = getAppSession(getState());
  let appSession: number = registredAppSession !== null ? Number(registredAppSession) : 0;
  appSession = appSession + 1;

  return dispatch({type: SAVE_INCREMENT, payload: appSession});
};
