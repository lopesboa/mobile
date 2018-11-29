// @flow
/* eslint-disable import/prefer-default-export */

import type {QuestionType, SpaceType} from './types';

type QuestionTypeKey = 'QCM';
export const QUESTION_TYPE: {
  [QuestionTypeKey]: QuestionType,
} = {
  QCM: 'qcm',
};

export const SPACE: {
  [string]: SpaceType,
} = {
  TINY: 'tiny',
  SMALL: 'small',
  BASE: 'base',
  LARGE: 'large',
};
