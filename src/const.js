// @flow strict

/* eslint-disable import/prefer-default-export */

import type {QuestionType, MediaType} from '@coorpacademy/progression-engine';

import type {SpaceType, CardType, ResourceType, Engine, ContentType} from './types';

export const RESOURCE_TYPE: {
  [string]: ResourceType
} = {
  VIDEO: 'video',
  PDF: 'pdf',
  IMG: 'img'
};

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
  IMAGE: 'img'
};

export const CARD_TYPE: {
  [string]: CardType
} = {
  TIP: 'tip',
  KEY_POINT: 'keyPoint',
  CORRECTION: 'correction'
};

export const CONTENT_TYPE: {
  [string]: ContentType
} = {
  DISCIPLINE: 'discipline',
  CHAPTER: 'chapter',
  LEVEL: 'level',
  SLIDE: 'slide',
  SUCCESS: 'success',
  FAILURE: 'failure'
};

type SpecificContentRef = 'extraLife' | 'failureExitNode' | 'successExitNode';
export const SPECIFIC_CONTENT_REF: {
  [string]: SpecificContentRef
} = {
  EXTRA_LIFE: 'extraLife',
  FAILURE_EXIT_NODE: 'failureExitNode',
  SUCCESS_EXIT_NODE: 'successExitNode'
};

export const ENGINE: {
  [string]: Engine
} = {
  LEARNER: 'learner',
  MICROLEARNING: 'microlearning'
};
