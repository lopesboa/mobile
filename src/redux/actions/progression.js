// @flow strict

/* eslint-disable import/prefer-default-export */

export const PROGRESSION_START = 'PROGRESSION_START';
export const PROGRESSION_NEXT = 'PROGRESSION_NEXT';
export const PROGRESSION_SET_LIVES = 'PROGRESSION_SET_LIVES';
export const PROGRESSION_LOSE_LIFE = 'PROGRESSION_LOSE_LIFE';

type StartProgressionPayload = {|
  current: number,
  count: number
|};

type SetLivesPayload = {|
  lives?: number
|};

export type Action = {|
  type:
    | 'PROGRESSION_START'
    | 'PROGRESSION_NEXT'
    | 'PROGRESSION_SET_LIVES'
    | 'PROGRESSION_LOSE_LIFE',
  payload?: StartProgressionPayload | SetLivesPayload
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

export const setLivesProgression = (lives?: number): Action => ({
  type: PROGRESSION_SET_LIVES,
  payload: {
    lives
  }
});

export const loseLifeProgression = (): Action => ({
  type: PROGRESSION_LOSE_LIFE
});
