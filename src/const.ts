import type {
  QuestionType,
  VideoMimeType,
  ResourceMimeType,
} from './types/coorpacademy/progression-engine';

import type {
  AppState,
  AuthorType,
  DeckCardType,
  ContentType,
  SectionContentType,
  SectionType,
  ErrorType,
  QuestionChoiceInputType,
  SpaceType,
  TooltipType,
  PermissionType,
  NotificationType,
  PartialRecord,
} from './types';

export const RESOURCE_TYPE = {
  VIDEO: 'video',
  PDF: 'pdf',
  IMG: 'img',
} as const;

export const ERROR_TYPE: Record<'PLATFORM_NOT_ACTIVATED' | 'NO_CONTENT_FOUND', ErrorType> = {
  PLATFORM_NOT_ACTIVATED: 'PLATFORM_NOT_ACTIVATED',
  NO_CONTENT_FOUND: 'NO_CONTENT_FOUND',
};

type QuestionTypeKey = 'QCM' | 'QCM_GRAPHIC' | 'SLIDER' | 'TEMPLATE' | 'DRAG_DROP' | 'BASIC';
export const QUESTION_TYPE: PartialRecord<QuestionTypeKey, QuestionType> = {
  QCM: 'qcm',
  QCM_GRAPHIC: 'qcmGraphic',
  SLIDER: 'slider',
  TEMPLATE: 'template',
  DRAG_DROP: 'qcmDrag',
  BASIC: 'basic',
};

export const QUESTION_CHOICE_INPUT_TYPE: Record<'TEXT' | 'SELECT', QuestionChoiceInputType> = {
  TEXT: 'text',
  SELECT: 'select',
};

export const SPACE: Record<'TINY' | 'SMALL' | 'BASE' | 'LARGE', SpaceType> = {
  TINY: 'tiny',
  SMALL: 'small',
  BASE: 'base',
  LARGE: 'large',
};

export const MEDIA_TYPE = {
  IMAGE: 'img',
} as const;

export const DECK_CARD_TYPE: Record<
  'RESOURCE' | 'TIP' | 'KEY_POINT' | 'CORRECTION',
  DeckCardType
> = {
  RESOURCE: 'resource',
  TIP: 'tip',
  KEY_POINT: 'keyPoint',
  CORRECTION: 'correction',
};

export const SECTION_CONTENT_TYPE: Record<'COURSE' | 'CHAPTER' | 'ALL', SectionContentType> = {
  COURSE: 'course',
  CHAPTER: 'chapter',
  ALL: 'all',
};

export const SECTION_TYPE: Record<'CARDS' | 'NEWS' | 'BATTLE', SectionType> = {
  CARDS: 'cards',
  NEWS: 'news',
  BATTLE: 'battle',
};

export const TOOLTIP_TYPE: Record<'HIGHSCORE' | 'UNLOCK', TooltipType> = {
  HIGHSCORE: 'highscore',
  UNLOCK: 'unlock',
};

export const AUTHOR_TYPE: Record<'COORP' | 'VERIFIED' | 'MARKETPLACE' | 'CUSTOM', AuthorType> = {
  COORP: 'coorp',
  VERIFIED: 'verified',
  MARKETPLACE: 'marketplace',
  CUSTOM: 'custom',
};

export const CONTENT_TYPE: Record<
  'DISCIPLINE' | 'CHAPTER' | 'LEVEL' | 'NODE' | 'SLIDE' | 'SUCCESS' | 'FAILURE',
  ContentType
> = {
  DISCIPLINE: 'discipline',
  CHAPTER: 'chapter',
  LEVEL: 'level',
  NODE: 'node',
  SLIDE: 'slide',
  SUCCESS: 'success',
  FAILURE: 'failure',
};

export const SPECIFIC_CONTENT_REF = {
  EXTRA_LIFE: 'extraLife',
  FAILURE_EXIT_NODE: 'failureExitNode',
  SUCCESS_EXIT_NODE: 'successExitNode',
} as const;

export const ENGINE = {
  LEARNER: 'learner',
  MICROLEARNING: 'microlearning',
} as const;

export const PERMISSION_RECURENCE = {
  FIRST: 1,
  SECOND: 10,
  THIRD: 30,
} as const;

export const PERMISSION_STATUS = {
  GRANTED: 'granted',
  DENIED: 'denied',
  RESTRICTED: 'restricted',
  UNDETERMINED: 'undetermined',
  UNAVAILABLE: 'unavailable',
  MAYBE_LATER: 'maybe-later',
  BLOCKED: 'blocked',
} as const;

export const PERMISSION_TYPE: Record<'CAMERA' | 'NOTIFICATIONS', PermissionType> = {
  CAMERA: 'camera',
  NOTIFICATIONS: 'notifications',
};

export const NOTIFICATION_TYPE: Record<'FINISH_COURSE', NotificationType> = {
  FINISH_COURSE: 'finish-course',
};

export const APP_STATE: PartialRecord<'ACTIVE' | 'BACKGROUND' | 'INACTIVE', AppState> = {
  ACTIVE: 'active',
  BACKGROUND: 'background',
  INACTIVE: 'inactive',
};

export const VIDEO_MIME_TYPE: Record<
  'KONTIKI' | 'JWPLAYER' | 'VIMEO' | 'OMNIPLAYER' | 'YOUTUBE',
  VideoMimeType
> = {
  KONTIKI: 'application/kontiki',
  JWPLAYER: 'application/jwplayer',
  VIMEO: 'application/vimeo',
  OMNIPLAYER: 'application/omniPlayer',
  YOUTUBE: 'application/youtube',
};

export const RESOURCE_MIME_TYPE: Record<
  keyof typeof VIDEO_MIME_TYPE | 'PDF' | 'PNG' | 'MP4' | 'JPEG',
  ResourceMimeType
> = {
  ...VIDEO_MIME_TYPE,
  PDF: 'application/pdf',
  PNG: 'image/png',
  MP4: 'video/mp4',
  JPEG: 'image/jpeg',
};

export const ANALYTICS_EVENT_TYPE = {
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
  PERMISSION: 'permission',
  NOTIFICATIONS_MAYBE_LATER: 'notificationsMaybeLater',
  NOTIFICATIONS_YES_NOTIFY_ME: 'notificationsYesNotifyMe',
  NOTIFICATIONS_OPENED: 'notificationsOpened',
  NOTIFICATIONS_TOGGLE: 'notificationsToggle',
  NOTIFICATIONS: 'notifications',
} as const;

export const AUTHENTICATION_TYPE = {
  QR_CODE: 'qr-code',
  DEMO: 'demo',
  MAGIC_LINK: 'magic-link',
  RECONNECTION: 'reconnection',
} as const;
