// @flow strict

import type {ErrorType} from '../../../types';
import type {StoreAction} from '../../_types';

export const SHOW = '@@modal/SHOW';
export const HIDE = '@@modal/HIDE';

export type Action<T> =
  | {|
      type: '@@modal/SHOW',
      payload: {
        errorType: ErrorType,
        lastAction?: () => StoreAction<T>
      }
    |}
  | {|
      type: '@@modal/HIDE'
    |};

export const showModal = <T>({
  errorType,
  lastAction
}: {
  errorType: ErrorType,
  lastAction?: () => StoreAction<T>
}): Action<T> => ({
  type: SHOW,
  payload: {
    errorType,
    lastAction
  }
});

export const hideModal = <T>(): Action<T> => ({
  type: HIDE
});

export const refresh = <T>(): StoreAction<Action<T>> => {
  return (dispatch, getState) => {
    const {error} = getState();
    if (error.lastAction) {
      dispatch(error.lastAction());
    }

    return dispatch(hideModal());
  };
};
