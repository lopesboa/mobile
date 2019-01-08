// @flow strict

/* eslint-disable import/prefer-default-export */

export const PROGRESSION_START = 'PROGRESSION_START';
export const PROGRESSION_NEXT = 'PROGRESSION_NEXT';

type NextProgressionPayload = {|
  current: number,
  count: number
|};

export type Action = {|
  type: 'PROGRESSION_START' | 'PROGRESSION_NEXT',
  payload?: NextProgressionPayload
|};

export const startProgression = (current: number, count: number): Action => ({
  type: PROGRESSION_START,
  payload: {
    current,
    count
  }
});

export const nextProgression = (): Action => ({
  type: PROGRESSION_NEXT
});
