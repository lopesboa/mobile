import {VALIDATE_ANSWER} from '../../actions/ui/answers';
import type {Action} from '../../actions/ui/answers';

export type State = boolean;

export const initialState: State = false;

const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case VALIDATE_ANSWER: {
      return action.payload;
    }
    default:
      return state;
  }
};

export default reducer;
