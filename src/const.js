// @flow strict

import type {LessonType, QuestionType, MediaType} from '@coorpacademy/progression-engine';

import type {
  AnalyticsEventType,
  AppState,
  AuthenticationType,
  AuthorType,
  DeckCardType,
  ContentType,
  SectionContentType,
  SectionType,
  Engine,
  ErrorType,
  PermissionStatus,
  QuestionChoiceInputType,
  SpaceType,
  TooltipType,
  VideoProviderMimeType
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

export const DECK_CARD_TYPE: {
  [string]: DeckCardType
} = {
  RESOURCE: 'resource',
  TIP: 'tip',
  KEY_POINT: 'keyPoint',
  CORRECTION: 'correction'
};

export const SECTION_CONTENT_TYPE: {
  [string]: SectionContentType
} = {
  COURSE: 'course',
  CHAPTER: 'chapter',
  ALL: 'all'
};

export const SECTION_TYPE: {
  [string]: SectionType
} = {
  CARDS: 'cards',
  NEWS: 'news',
  BATTLE: 'battle'
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

export const VIDEO_PROVIDER_MIME_TYPE: {
  ['KONTIKI' | 'JWPLAYER' | 'VIMEO']: VideoProviderMimeType
} = {
  KONTIKI: 'application/kontiki',
  JWPLAYER: 'application/jwplayer',
  VIMEO: 'application/vimeo'
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
  DEMO: 'demo',
  MAGIC_LINK: 'magic-link',
  RECONNECTION: 'reconnection'
} = {
  QR_CODE: 'qr-code',
  DEMO: 'demo',
  MAGIC_LINK: 'magic-link',
  RECONNECTION: 'reconnection'
};
// FlowAssert
(Object.keys(AUTHENTICATION_TYPE).map(k => AUTHENTICATION_TYPE[k]): Array<AuthenticationType>);
