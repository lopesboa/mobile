// @flow strict

export const FOCUS = '@@select/FOCUS';
export const BLUR = '@@select/BLUR';

export type Action =
  | {|
      type: '@@select/FOCUS',
      payload: string
    |}
  | {|
      type: '@@select/BLUR'
    |};

export const focus = (id: string): Action => ({
  type: FOCUS,
  payload: id
});

export const blur = (): Action => ({
  type: BLUR
});
