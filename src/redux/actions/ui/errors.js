// @flow strict

import type {ErrorType} from '../../../types';
import type {StoreAction} from '../../_types';

export const SHOW = '@@errors/SHOW';
export const HIDE = '@@errors/HIDE';

export type Action<T> =
  | {|
      type: '@@errors/SHOW',
      payload: {
        type: ErrorType,
        lastAction?: () => StoreAction<T>
      }
    |}
  | {|
      type: '@@errors/HIDE'
    |};

export const showError = <T>({
  type,
  lastAction
}: {
  type: ErrorType,
  lastAction?: () => StoreAction<T>
}): Action<T> => ({
  type: SHOW,
  payload: {
    type,
    lastAction
  }
});

export const hideError = <T>(): Action<T> => ({
  type: HIDE
});

export const refresh = <T>(): StoreAction<Action<T>> => {
  return (dispatch, getState) => {
    const {error} = getState();
    if (error.lastAction) {
      dispatch(error.lastAction());
    }

    return dispatch(hideError());
  };
};
