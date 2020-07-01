import {some, isArray, get, flatten, each} from 'lodash/fp';
import type {Progression} from '@coorpacademy/progression-engine';

import type {Predicate, Transformer} from '../../types';

const isDeeplyNested = (arr: Array<string | Array<string>>): boolean => some(isArray, arr);

const flattenAnswers = (arr: Array<string | Array<string>>): Array<string> => {
  if (isDeeplyNested(arr)) {
    return flatten(arr);
  }
  // @ts-ignore
  return arr;
};

export const transformer: Transformer = (stringifiedProgression: string): string => {
  const progression: Progression = JSON.parse(stringifiedProgression);
  each((action) => {
    if (action.type === 'answer') {
      action.payload.answer = flattenAnswers(action.payload.answer);
    }
  }, get('actions', progression));
  each((answer) => {
    answer.answer = flattenAnswers(answer.answer);
  }, get('state.allAnswers', progression));
  return JSON.stringify(progression);
};

export const predicate: Predicate = (key: string): boolean => key.startsWith('progression_');

export default {
  predicate,
  transformer,
};
