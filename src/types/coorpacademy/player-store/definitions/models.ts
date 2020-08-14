import {ValueOf} from '../../../../types';

import {
  FAILURE,
  SUCCESS,
  Answer,
  Content,
  ContentInfo,
  ContentType,
  Engines,
  Media,
  PartialCorrection,
  ResourceMimeType,
  Source,
} from '../../progression-engine';

export const CONTENT_TYPE: Record<'CHAPTER' | 'LEVEL' | 'SLIDE', ContentType> = {
  CHAPTER: 'chapter',
  LEVEL: 'level',
  SLIDE: 'slide',
};

export const ENGINES: Record<'MICROLEARNING' | 'LEARNER', Engines> = {
  MICROLEARNING: 'microlearning',
  LEARNER: 'learner',
};

export const VIDEO_TRACK_KIND = {
  CAPTIONS: 'captions',
  THUMBNAILS: 'thumbnails',
} as const;

export const VIDEO_TRACK_TYPE = {
  SRT: 'srt',
  VTT: 'vtt',
} as const;

export type Url = string;
export type AspectRatio = '16:9' | '4:3';
export type ResourceType = 'video' | 'pdf';

// eslint-disable-next-line no-shadow
export type MimeType =
  | 'video/mp4'
  | 'application/vimeo'
  | 'image/jpeg'
  | 'image/png'
  | 'application/pdf'
  | 'application/vimeo';

export type JwPlayerOptions = {
  customProps: {
    aspectratio: AspectRatio;
    autostart: boolean;
    skin: {
      name: string;
    };
    width: string;
  };
  file: Url;
  licenseKey: string;
  playerId: string;
  playerScript: Url;
};

export type Resource = {
  _id: string;
  ref: string;
  type: ResourceType;
  mimeType: ResourceMimeType;
  mediaUrl: Url;
  src?: Array<Source>;
  description?: string;
  poster?: Url;
  subtitles?: Array<string>;
  posters?: Array<Url>;
  jwpOptions?: JwPlayerOptions;
};

export type Clue = string;

export type Meta = {
  updatedAt: string;
  createdAt: string;
  taggedNewUntil?: string;
};

export type Recommendation = {
  view: string;
  image: Url;
  time: string;
  type: string;
  title: string;
  author: string;
  cta: string;
  href: string;
};

export type ExitNodeRef = 'successExitNode' | 'failureExitNode';
export type ExitNodeType = SUCCESS | FAILURE;

export type ExitNode = {
  ref: ExitNodeRef;
  type: ExitNodeType;
  meta: Meta;
  title: string;
  description: string;
  media: Media;
};

export type Poster = {
  type?: string;
  mimeType?: ResourceMimeType;
  mediaUrl?: Url;
  subtitles?: Array<string>;
  posters?: Array<Url>;
  src?: Array<Source>;
};

export type Chapter = {
  _id: string;
  universalRef: string;
  name: string;
  stars: number;
  freeRun: boolean;
  meta: Meta;
  poster: Poster;
  info?: ContentInfo;
  bestScore?: number;
  isConditional: boolean;
  time: number;
  version: string;
};

export type Stats = {
  userTriesCount: number;
  userDoneCount: number;
};

export type Level = {
  _id: string;
  universalRef?: string;
  disciplineRef?: string;
  disciplineUniversalRef?: string;
  ref: string;
  name?: string;
  level: string;
  meta?: Meta;
  poster?: Poster;
  chapterIds: Array<string>;
  levelTranslation?: string;
  mediaUrl?: Url;
  timeAlloted?: number;
  eligibleBattle?: boolean;
  creditsToAccess?: number;
  infiniteLives?: boolean;
  isConditional?: boolean;
  acquiredSkills?: Array<string>;
  data: Array<string | null | undefined>;
  stats: Stats;
  version: string;
  accessible?: boolean;
  external_refs: Array<string | null | undefined>;
  info?: ContentInfo;
  bestScore?: number;
};

export type ExtentedMedia = {
  type?: string;
  mimeType?: MimeType;
  mediaUrl?: Url;
  subtitles: Array<string>;
  posters: Array<string>;
  src: Array<string>;
};
export type Cover = {
  description: string;
  media: ExtentedMedia;
};

export type Skill = string;
export type Group = string;
export type Condition = string;
export type Partner = string;

export type Stat = {
  userTriesCount: number;
  userDoneCount: number;
};

export type Discipline = {
  _id: string;
  ref: string;
  universalRef: string;
  name: string;
  partnershipType: string;
  deliverCoachStatus?: boolean;
  hidden: boolean;
  position: number;
  conditions: Array<Condition>;
  skills: Array<Skill>;
  groups: Array<Group>;
  stats: Stat;
  meta: Meta;
  partners: Array<Partner>;
  modules: Array<Level>;
  cover?: Cover;
  version: string;
};

export type UserAnswer = {
  answer: Answer;
  content: Content;
};

export type Correction = {
  correctAnswer: Array<Answer>;
  corrections: Array<PartialCorrection>;
};

export type Lives = {
  hide: boolean;
  count: number;
};

export type VideoProvider = 'jwplayer' | 'kontiki' | 'vimeo' | 'omniPlayer' | 'youtube';

export type VideoTrack = {
  kind: ValueOf<typeof VIDEO_TRACK_KIND>;
  file: string;
  label?: string;
  default?: boolean;
};

export type VideoTrackType = ValueOf<typeof VIDEO_TRACK_TYPE>;
