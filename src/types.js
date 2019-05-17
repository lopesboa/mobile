// @flow strict

import type {
  ContentType as ContentTypeBase,
  GenericContent as GenericContentBase,
  Lesson
} from '@coorpacademy/progression-engine';

export type JWT = {|
  exp: number,
  iat: number,
  grants: mixed,
  iss: string,
  user: string,
  usage: string,
  host: string
|};

export type QuestionChoiceInputType = 'text' | 'select';

export type MimeType =
  | 'video/mp4'
  | 'application/vimeo'
  | 'image/jpeg'
  | 'image/png'
  | 'application/pdf'
  | 'application/vimeo';

export type SpaceType = 'micro' | 'tiny' | 'small' | 'base' | 'medium' | 'large' | 'xlarge';

export type TooltipType = 'highscore' | 'unlock';

export type CardType = 'tip' | 'keyPoint' | 'correction' | 'resource';

export type CardDisplayMode = 'card' | 'cover';

export type AuthorType = 'coorp' | 'verified' | 'custom' | 'marketplace';

export type AnimationType = 'in' | 'out';

export type Question = string;

export type Engine = 'learner' | 'microlearning';

export type ContentType = ContentTypeBase | 'discipline' | 'success' | 'failure' | 'node';

export type Resource = {|
  ...Lesson,
  url: string
|};

export type GenericContent = $Exact<{|
  ...GenericContentBase,
  type: ContentType
|}>;

export type Progression = {|
  current: number,
  count: number
|};

export type Brand = {|
  name: string,
  host: string,
  contentCategoryName: string,
  colors: {
    primary: string
  },
  images: {
    'logo-mobile': string
  }
|};

export type PermissionStatus = 'authorized' | 'denied' | 'restricted' | 'undetermined';

export type UnlockedLevelInfo = {|
  isUnlocked: boolean,
  levelName: string
|};
export type ErrorType = 'PLATFORM_NOT_ACTIVATED' | 'NO_CONTENT_FOUND';

export type AppState = 'active' | 'background' | 'inactive';

export type AnalyticsEventType =
  | 'swipe'
  | 'press'
  | 'longPress'
  | 'slide'
  | 'mediaViewed'
  | 'startProgression'
  | 'openSelect'
  | 'closeSelect'
  | 'inputBlur'
  | 'inputFocus'
  | 'finishProgression'
  | 'signIn'
  | 'signOut'
  | 'navigate'
  | 'permission'
  | 'validateAnswer';

export type AnalyticsEventParams = {
  [key: string]: string | number
};

export type URLEventType = {|
  url: string
|};

export type AuthenticationType = 'qr-code' | 'magic-link' | 'demo' | 'reconnection';
