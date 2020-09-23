import {SIGN_OUT} from '../actions/authentication';

type Action = {type: string};
const resetOnLogout = <S, A extends Action>(reducer: (state: undefined | S, action: A) => S) => (
  state: S,
  action: A,
): S => {
  switch (action.type) {
    case SIGN_OUT: {
      return reducer(undefined, action);
    }
    default: {
      return reducer(state, action);
    }
  }
};

export {SIGN_OUT};
export default resetOnLogout;
