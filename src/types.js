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

export type VideoProviderMimeType =
  | 'application/jwplayer'
  | 'application/kontiki'
  | 'application/vimeo';

export type MimeType =
  | VideoProviderMimeType
  | 'video/mp4'
  | 'image/jpeg'
  | 'image/png'
  | 'application/pdf';

export type SpaceType = 'micro' | 'tiny' | 'small' | 'base' | 'medium' | 'large' | 'xlarge';

export type TooltipType = 'highscore' | 'unlock';

export type DeckCardType = 'tip' | 'keyPoint' | 'correction' | 'resource';

export type AuthorType = 'coorp' | 'verified' | 'custom' | 'marketplace';

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

export type ProgressionCount = {|
  current: number,
  count: number
|};

export type SectionType = 'cards' | 'news' | 'battle';
export type SectionContentType = 'course' | 'chapter' | 'all';

export type Section = {|
  type: SectionType,
  order: number,
  key: string,
  title: string,
  endpoint: string,
  query: {
    contentType?: SectionContentType,
    goal?: string,
    playlist?: string,
    skill?: string,
    sort?: string,
    theme?: string,
    type?: SectionContentType
  },
  cardsRef?: Array<string | void>
|};

export type ProgressionEngineVersions = {|
  versions: {
    [Engine]: string
  }
|};

export type Brand = {|
  name: string,
  host: string,
  contentCategoryName: string,
  colors: {
    primary: string
  },
  hero?: string,
  images: {
    'logo-mobile': string
  },
  progressionEngine: ProgressionEngineVersions,
  supportedLanguages: Array<string>,
  defaultLanguage: string
|};

export type User = {|
  displayName: string,
  familyName: string,
  givenName: string
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

export type LoggerProperties = {
  [key: string]: string | null
};

export type AuthenticationType = 'qr-code' | 'magic-link' | 'demo' | 'reconnection';
