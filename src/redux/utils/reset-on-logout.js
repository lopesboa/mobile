// @flow strict
import {SIGN_OUT} from '../actions/authentication';

const resetOnLogout = <S, A: {type: string}>(reducer: (state?: S, action: A) => S) => (
  state?: S,
  action: A
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
