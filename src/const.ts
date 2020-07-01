import type {
  LessonType,
  QuestionType,
  MediaType,
  VideoMimeType,
  ResourceMimeType
} from '@types/coorp/progression-engine';

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
  PermissionType
} from './types';
import {$Keys} from "utility-types";

export const RESOURCE_TYPE: {
  VIDEO: "video";
  PDF: "pdf";
  IMG: "img";
} = {
  VIDEO: "video",
  PDF: "pdf",
  IMG: "img",
};

export const ERROR_TYPE: {
  [key: string]: ErrorType;
} = {
  PLATFORM_NOT_ACTIVATED: "PLATFORM_NOT_ACTIVATED",
  NO_CONTENT_FOUND: "NO_CONTENT_FOUND",
};

type QuestionTypeKey =
  | "QCM"
  | "QCM_GRAPHIC"
  | "SLIDER"
  | "TEMPLATE"
  | "DRAG_DROP"
  | "BASIC";
export const QUESTION_TYPE: {[key in QuestionTypeKey]?: QuestionType} = {
  QCM: "qcm",
  QCM_GRAPHIC: "qcmGraphic",
  SLIDER: "slider",
  TEMPLATE: "template",
  DRAG_DROP: "qcmDrag",
  BASIC: "basic",
};

export const QUESTION_CHOICE_INPUT_TYPE: {
  [key: string]: QuestionChoiceInputType;
} = {
  TEXT: "text",
  SELECT: "select",
};

export const SPACE: {
  [key: string]: SpaceType;
} = {
  TINY: "tiny",
  SMALL: "small",
  BASE: "base",
  LARGE: "large",
};

export const MEDIA_TYPE: {
  IMAGE: "img";
} = {
  IMAGE: "img",
};

export const DECK_CARD_TYPE: {
  [key: string]: DeckCardType;
} = {
  RESOURCE: "resource",
  TIP: "tip",
  KEY_POINT: "keyPoint",
  CORRECTION: "correction",
};

export const SECTION_CONTENT_TYPE: {
  [key: string]: SectionContentType;
} = {
  COURSE: "course",
  CHAPTER: "chapter",
  ALL: "all",
};

export const SECTION_TYPE: {
  [key: string]: SectionType;
} = {
  CARDS: "cards",
  NEWS: "news",
  BATTLE: "battle",
};

export const TOOLTIP_TYPE: {
  [key: string]: TooltipType;
} = {
  HIGHSCORE: "highscore",
  UNLOCK: "unlock",
};

export const AUTHOR_TYPE: {
  [key: string]: AuthorType;
} = {
  COORP: "coorp",
  VERIFIED: "verified",
  MARKETPLACE: "marketplace",
  CUSTOM: "custom",
};

export const CONTENT_TYPE: {
  [key: string]: ContentType;
} = {
  DISCIPLINE: "discipline",
  CHAPTER: "chapter",
  LEVEL: "level",
  NODE: "node",
  SLIDE: "slide",
  SUCCESS: "success",
  FAILURE: "failure",
};

type SpecificContentRef = "extraLife" | "failureExitNode" | "successExitNode";
export const SPECIFIC_CONTENT_REF: {
  [key: string]: SpecificContentRef;
} = {
  EXTRA_LIFE: "extraLife",
  FAILURE_EXIT_NODE: "failureExitNode",
  SUCCESS_EXIT_NODE: "successExitNode",
};

export const ENGINE: {
  LEARNER: "learner";
  MICROLEARNING: "microlearning";
} = {
  LEARNER: "learner",
  MICROLEARNING: "microlearning",
};

export const PERMISSION_STATUS: {
  [key in
    | "GRANTED"
    | "DENIED"
    | "RESTRICTED"
    | "UNDETERMINED"
    | "UNAVAILABLE"
    | "MAYBE_LATER"
    | "BLOCKED"]: PermissionStatus
} = {
  GRANTED: "granted",
  DENIED: "denied",
  RESTRICTED: "restricted",
  UNDETERMINED: "undetermined",
  UNAVAILABLE: 'unavailable',
  MAYBE_LATER: 'maybe-later',
  BLOCKED: "blocked",
};

export const PERMISSION_TYPE: {
  [key in
    | "CAMERA"
    | "NOTIFICATIONS"]: PermissionType
} = {
  CAMERA: "camera",
  NOTIFICATIONS: "notifications"
};


export const APP_STATE: {
  [key in "ACTIVE" | "BACKGROUND" | "INACTIVE"]?: AppState
} = {
  ACTIVE: "active",
  BACKGROUND: "background",
  INACTIVE: "inactive",
};

export const VIDEO_MIME_TYPE: {
  [key in
    | "KONTIKI"
    | "JWPLAYER"
    | "VIMEO"
    | "OMNIPLAYER"
    | "YOUTUBE"]?: VideoMimeType
} = {
  KONTIKI: "application/kontiki",
  JWPLAYER: "application/jwplayer",
  VIMEO: "application/vimeo",
  OMNIPLAYER: "application/omniPlayer",
  YOUTUBE: "application/youtube",
};

export const RESOURCE_MIME_TYPE: {
  [key in
    | $Keys<typeof VIDEO_MIME_TYPE>
    | "PDF"
    | "PNG"
    | "MP4"
    | "JPEG"]?: ResourceMimeType
} = {
  ...VIDEO_MIME_TYPE,
  PDF: "application/pdf",
  PNG: "image/png",
  MP4: "video/mp4",
  JPEG: "image/jpeg",
};

export const ANALYTICS_EVENT_TYPE: {
  PRESS: "press";
  SWIPE: "swipe";
  LONG_PRESS: "longPress";
  SLIDE: "slide";
  MEDIA_VIEWED: "mediaViewed";
  START_PROGRESSION: "startProgression";
  OPEN_SELECT: "openSelect";
  CLOSE_SELECT: "closeSelect";
  INPUT_BLUR: "inputBlur";
  INPUT_FOCUS: "inputFocus";
  FINISH_PROGRESSION: "finishProgression";
  SIGN_IN: "signIn";
  SIGN_OUT: "signOut";
  NAVIGATE: "navigate";
  VALIDATE_ANSWER: "validateAnswer";
  PERMISSION: "permission";
} = {
  PRESS: "press",
  SWIPE: "swipe",
  LONG_PRESS: "longPress",
  SLIDE: "slide",
  MEDIA_VIEWED: "mediaViewed",
  START_PROGRESSION: "startProgression",
  OPEN_SELECT: "openSelect",
  CLOSE_SELECT: "closeSelect",
  INPUT_BLUR: "inputBlur",
  INPUT_FOCUS: "inputFocus",
  FINISH_PROGRESSION: "finishProgression",
  SIGN_IN: "signIn",
  SIGN_OUT: "signOut",
  NAVIGATE: "navigate",
  VALIDATE_ANSWER: "validateAnswer",
  PERMISSION: "permission",
};

export const AUTHENTICATION_TYPE: {
  QR_CODE: "qr-code";
  DEMO: "demo";
  MAGIC_LINK: "magic-link";
  RECONNECTION: "reconnection";
} = {
  QR_CODE: "qr-code",
  DEMO: "demo",
  MAGIC_LINK: "magic-link",
  RECONNECTION: "reconnection",
};
