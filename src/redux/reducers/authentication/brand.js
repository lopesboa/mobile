// @flow strict

import type {Brand} from '../../../types';
import type {Action} from '../../actions/brands';
import {FETCH_SUCCESS} from '../../actions/brands';

export type State = Brand | null;

export const initialState: State = null;

const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case FETCH_SUCCESS: {
      return action.payload.item;
    }
    default:
      return state;
  }
};

export default reducer;
