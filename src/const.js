// @flow strict
/* eslint-disable import/prefer-default-export */

import type {QuestionType, SpaceType, MediaType, CardType, LevelType} from './types';

type QuestionTypeKey = 'QCM' | 'QCM_GRAPHIC';
export const QUESTION_TYPE: {
  [QuestionTypeKey]: QuestionType
} = {
  QCM: 'qcm',
  QCM_GRAPHIC: 'qcmGraphic'
};

export const SPACE: {
  [string]: SpaceType
} = {
  TINY: 'tiny',
  SMALL: 'small',
  BASE: 'base',
  LARGE: 'large'
};

export const MEDIA_TYPE: {
  [string]: MediaType
} = {
  IMAGE: 'image'
};

export const CARD_TYPE: {
  [string]: CardType
} = {
  TIP: 'tip',
  KEY_POINT: 'keyPoint',
  CORRECTION: 'correction'
};

export const LEVEL_TYPE: {
  [string]: LevelType
} = {
  BASE: 'base',
  ADVANCED: 'advanced',
  COACH: 'coach'
};
