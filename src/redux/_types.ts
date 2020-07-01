import type {Services} from '../services';
import {StoreState} from './store';

export type Options = {services: Services};

// @ts-ignore this is a hacked type
export type ReduxDevTools = () => void;

type ThunkAction<S, A, O> =
  | A
  | ((
      dispatch: (arg0: ThunkAction<S, A, O>) => Promise<A | void>,
      getState: () => S,
      options: O,
    ) => Promise<A | void>);

export type StoreAction<A> = ThunkAction<StoreState, A, Options>;

export type StoreErrorAction<T> = T & {
  payload: Error;
  error: boolean;
};
