// @flow strict

export const TOGGLE = '@@search/TOGGLE';
export const EDIT = '@@search/EDIT';
export const FETCH = '@@search/FETCH';

export type Action =
  | {|
      type: '@@search/TOGGLE',
      payload: boolean
    |}
  | {|
      type: '@@search/EDIT',
      payload: string
    |}
  | {|
      type: '@@search/FETCH',
      payload: boolean
    |};

export const toggle = (payload: boolean): Action => ({
  type: TOGGLE,
  payload
});

export const edit = (payload: string): Action => ({
  type: EDIT,
  payload
});

export const fetch = (payload: boolean): Action => ({
  type: FETCH,
  payload
});
