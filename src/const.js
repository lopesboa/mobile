// @flow strict
/* eslint-disable import/prefer-default-export */

import type {QuestionType, MediaType, ContentType} from '@coorpacademy/progression-engine';
import type {SpaceType, CardType, LevelType, ResourceType} from './types';

export const RESSOURCE_TYPE: {
  [string]: ResourceType
} = {
  VIDEO: 'video',
  PDF: 'pdf'
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

export const LEVEL_TYPE: {
  [string]: LevelType
} = {
  BASE: 'base',
  ADVANCED: 'advanced',
  COACH: 'coach'
};

export const CONTENT_TYPE: {
  [string]: ContentType
} = {
  CHAPTER: 'chapter',
  LEVEL: 'level',
  SLIDE: 'slide',
  NODE: 'node',
  FAILURE: 'failure',
  SUCCESS: 'success'
};

type SpecificContentRef = 'extraLife' | 'failureExitNode' | 'successExitNode';
export const SPECIFIC_CONTENT_REF: {
  [string]: SpecificContentRef
} = {
  EXTRA_LIFE: 'extraLife',
  FAILURE_EXIT_NODE: 'failureExitNode',
  SUCCESS_EXIT_NODE: 'successExitNode'
};
