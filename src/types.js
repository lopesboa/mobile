// @flow strict

import type {
  ContentType as ContentTypeBase,
  GenericContent as GenericContentBase,
  Lesson
} from '@coorpacademy/progression-engine';

import {VIDEO_HOTSPOT_EVENT_NAME, VIDEO_HOTSPOT_EVENT_CALLBACK_NAME} from './const';

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

export type CardType = 'tip' | 'keyPoint' | 'correction' | 'resource';

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
  progressionEngine: ProgressionEngineVersions
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

export type AuthenticationType = 'qr-code' | 'magic-link' | 'demo' | 'reconnection';

export type VideoHotspotEventName = 'play' | 'pause' | 'seek' | 'volume' | 'muted';

export type VideoHotspotEvent =
  | {|
      name: typeof VIDEO_HOTSPOT_EVENT_NAME.PLAY
    |}
  | {|
      name: typeof VIDEO_HOTSPOT_EVENT_NAME.PAUSE
    |}
  | {|
      name: typeof VIDEO_HOTSPOT_EVENT_NAME.SEEK,
      value: number
    |}
  | {|
      name: typeof VIDEO_HOTSPOT_EVENT_NAME.VOLUME,
      value: number
    |}
  | {|
      name: typeof VIDEO_HOTSPOT_EVENT_NAME.MUTED,
      value: number
    |};

export type VideoHotspotEventCallbackName =
  | 'init'
  | 'play'
  | 'pause'
  | 'apiready'
  | 'loadedmetadata'
  | 'timeupdate'
  | 'volumechange'
  | 'seeked';

export type VideoHotspotEventCallback =
  | {|
      name: typeof VIDEO_HOTSPOT_EVENT_CALLBACK_NAME.INIT,
      value: {publicationId: string}
    |}
  | {|
      name: typeof VIDEO_HOTSPOT_EVENT_CALLBACK_NAME.PLAY
    |}
  | {|
      name: typeof VIDEO_HOTSPOT_EVENT_CALLBACK_NAME.PAUSE
    |}
  | {|
      name: typeof VIDEO_HOTSPOT_EVENT_CALLBACK_NAME.API_READY
    |}
  | {|
      name: typeof VIDEO_HOTSPOT_EVENT_CALLBACK_NAME.LOADED_METADATA,
      value: {duration: number, time: number, width: number, height: number}
    |}
  | {|
      name: typeof VIDEO_HOTSPOT_EVENT_CALLBACK_NAME.TIME_UPDATE,
      value: number
    |}
  | {|
      name: typeof VIDEO_HOTSPOT_EVENT_CALLBACK_NAME.VOLUME_CHANGE,
      value: number
    |}
  | {|
      name: typeof VIDEO_HOTSPOT_EVENT_CALLBACK_NAME.SEEKED,
      value: number
    |};
