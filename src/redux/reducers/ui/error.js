// @flow strict

import type {ErrorType} from '../../../types';
import type {StoreAction} from '../../_types';
import {SHOW, HIDE} from '../../actions/ui/modal';
import type {Action} from '../../actions/ui/modal';

export type State<T> = {|
  isVisible: boolean,
  errorType?: ErrorType,
  lastAction?: () => StoreAction<T>
|};

export const initialState: State<void> = {
  isVisible: false
};

// $FlowFixMe initial state is empty of action
const reducer = <T>(state: State<T> = initialState, action: Action<T>): State<T> => {
  switch (action.type) {
    case SHOW: {
      return {
        ...state,
        isVisible: true,
        errorType: action.payload.errorType,
        lastAction: action.payload.lastAction
      };
    }
    case HIDE: {
      return {
        ...state,
        isVisible: false
      };
    }
    default:
      return state;
  }
};

export default reducer;
