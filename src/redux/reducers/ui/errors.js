// @flow strict

import type {ErrorType} from '../../../types';
import type {StoreAction} from '../../_types';
import {SHOW, HIDE} from '../../actions/ui/errors';
import type {Action} from '../../actions/ui/errors';

export type State<T> = {|
  isVisible: boolean,
  type?: ErrorType,
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
        type: action.payload.type,
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
