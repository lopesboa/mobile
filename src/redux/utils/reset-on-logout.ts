import {SIGN_OUT} from '../actions/authentication';

const resetOnLogout = (reducer) => (state, action) => {
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
