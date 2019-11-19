// @flow strict

import type {Services} from '../services';

export type Options = {services: Services};

// $FlowFixMe this is a hacked type
export type ReduxDevTools = () => void;

type ThunkAction<S, A, O> =
  | A
  | ((
      dispatch: (ThunkAction<S, A, O>) => Promise<A | void>,
      getState: () => S,
      O
    ) => Promise<A | void>);

export type StoreAction<A> = ThunkAction<StoreState, A, Options>;

export type StoreErrorAction<T> = {|
  ...T,
  payload: Error,
  error: boolean
|};
