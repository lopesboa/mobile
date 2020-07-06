import type {StoreAction} from '../_types';

export const INCREMENT = '@@app-session/INCREMENT';

export type Action = {
  type: '@@app-session/INCREMENT';
};

export const increment = (): StoreAction<Action> => (dispatch: Dispatch, getState: GetState) => {
  return dispatch({type: INCREMENT});
};
