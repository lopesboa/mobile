// @flow strict

import type {Brand} from '../../types';
import type {Action} from '../actions/brands';
import {FETCH_SUCCESS} from '../actions/brands';

export type State = {|
  entities: {
    [key: string]: Brand
  }
|};

export const initialState: State = {
  entities: {}
};

const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case FETCH_SUCCESS: {
      return {
        ...state,
        entities: {
          ...state.entities,
          [action.payload.token]: action.payload.item
        }
      };
    }
    default:
      return state;
  }
};

export default reducer;
