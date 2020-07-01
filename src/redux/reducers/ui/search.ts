import {EDIT, FETCH} from '../../actions/ui/search';
import type {Action} from '../../actions/ui/search';
import type {QueryParams} from '../../../modules/uri';

export type State = {
  isFetching: boolean;
  value?: string;
  params?: QueryParams;
};

export const initialState: State = {
  isFetching: false,
};

const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case EDIT: {
      return {
        ...state,
        value: action && action.payload.text,
        params: action && action.payload.params,
      };
    }
    case FETCH: {
      return {
        ...state,
        isFetching: action.payload,
      };
    }
    default:
      return state;
  }
};

export default reducer;
