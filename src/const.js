// @flow strict

import type {LessonType, QuestionType, MediaType} from '@coorpacademy/progression-engine';

import type {
  SpaceType,
  CardType,
  Engine,
  ContentType,
  CardDisplayMode,
  TooltipType,
  AuthorType,
  QuestionChoiceInputType,
  AnimationType,
  PermissionStatus,
  AppState,
  AnalyticsEventType,
  ErrorType,
  AuthenticationType
} from './types';

export const RESOURCE_TYPE: {
  [string]: LessonType
} = {
  VIDEO: 'video',
  PDF: 'pdf',
  IMG: 'img'
};

export const ERROR_TYPE: {[string]: ErrorType} = {
  PLATFORM_NOT_ACTIVATED: 'PLATFORM_NOT_ACTIVATED',
  NO_CONTENT_FOUND: 'NO_CONTENT_FOUND'
};

export const CARD_DISPLAY_MODE: {
  [string]: CardDisplayMode
} = {
  CARD: 'card',
  COVER: 'cover'
};

type QuestionTypeKey = 'QCM' | 'QCM_GRAPHIC' | 'SLIDER' | 'TEMPLATE' | 'DRAG_DROP' | 'BASIC';
export const QUESTION_TYPE: {
  [QuestionTypeKey]: QuestionType
} = {
  QCM: 'qcm',
  QCM_GRAPHIC: 'qcmGraphic',
  SLIDER: 'slider',
  TEMPLATE: 'template',
  DRAG_DROP: 'qcmDrag',
  BASIC: 'basic'
};

export const QUESTION_CHOICE_INPUT_TYPE: {
  [key: string]: QuestionChoiceInputType
} = {
  TEXT: 'text',
  SELECT: 'select'
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
  RESOURCE: 'resource',
  TIP: 'tip',
  KEY_POINT: 'keyPoint',
  CORRECTION: 'correction'
};

export const TOOLTIP_TYPE: {
  [string]: TooltipType
} = {
  HIGHSCORE: 'highscore',
  UNLOCK: 'unlock'
};

export const AUTHOR_TYPE: {
  [string]: AuthorType
} = {
  COORP: 'coorp',
  VERIFIED: 'verified',
  MARKETPLACE: 'marketplace',
  CUSTOM: 'custom'
};

export const CONTENT_TYPE: {
  [string]: ContentType
} = {
  DISCIPLINE: 'discipline',
  CHAPTER: 'chapter',
  LEVEL: 'level',
  NODE: 'node',
  SLIDE: 'slide',
  SUCCESS: 'success',
  FAILURE: 'failure'
};

export const ANIMATION_TYPE: {
  [string]: AnimationType
} = {
  IN: 'in',
  OUT: 'out'
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
  LEARNER: 'learner',
  MICROLEARNING: 'microlearning'
} = {
  LEARNER: 'learner',
  MICROLEARNING: 'microlearning'
};
// FlowAssert
(Object.keys(ENGINE).map(k => ENGINE[k]): Array<Engine>);

export const PERMISSION_STATUS: {
  ['AUTHORIZED' | 'DENIED' | 'RESTRICTED' | 'UNDETERMINED']: PermissionStatus
} = {
  AUTHORIZED: 'authorized',
  DENIED: 'denied',
  RESTRICTED: 'restricted',
  UNDETERMINED: 'undetermined'
};

export const APP_STATE: {
  ['ACTIVE' | 'BACKGROUND' | 'INACTIVE']: AppState
} = {
  ACTIVE: 'active',
  BACKGROUND: 'background',
  INACTIVE: 'inactive'
};

export const ANALYTICS_EVENT_TYPE: {
  PRESS: 'press',
  SWIPE: 'swipe',
  LONG_PRESS: 'longPress',
  SLIDE: 'slide',
  MEDIA_VIEWED: 'mediaViewed',
  START_PROGRESSION: 'startProgression',
  OPEN_SELECT: 'openSelect',
  CLOSE_SELECT: 'closeSelect',
  INPUT_BLUR: 'inputBlur',
  INPUT_FOCUS: 'inputFocus',
  FINISH_PROGRESSION: 'finishProgression',
  SIGN_IN: 'signIn',
  SIGN_OUT: 'signOut',
  NAVIGATE: 'navigate',
  VALIDATE_ANSWER: 'validateAnswer',
  PERMISSION: 'permission'
} = {
  PRESS: 'press',
  SWIPE: 'swipe',
  LONG_PRESS: 'longPress',
  SLIDE: 'slide',
  MEDIA_VIEWED: 'mediaViewed',
  START_PROGRESSION: 'startProgression',
  OPEN_SELECT: 'openSelect',
  CLOSE_SELECT: 'closeSelect',
  INPUT_BLUR: 'inputBlur',
  INPUT_FOCUS: 'inputFocus',
  FINISH_PROGRESSION: 'finishProgression',
  SIGN_IN: 'signIn',
  SIGN_OUT: 'signOut',
  NAVIGATE: 'navigate',
  VALIDATE_ANSWER: 'validateAnswer',
  PERMISSION: 'permission'
};
// FlowAssert
(Object.keys(ANALYTICS_EVENT_TYPE).map(k => ANALYTICS_EVENT_TYPE[k]): Array<AnalyticsEventType>);

export const AUTHENTICATION_TYPE: {
  QR_CODE: 'qr-code',
  MAGIC_LINK: 'magic-link'
} = {
  QR_CODE: 'qr-code',
  MAGIC_LINK: 'magic-link'
};
// FlowAssert
(Object.keys(AUTHENTICATION_TYPE).map(k => AUTHENTICATION_TYPE[k]): Array<AuthenticationType>);
