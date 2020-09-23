import {$Values} from 'utility-types';
import {
  Answer,
  ChapterRule,
  Content,
  ContentType,
  FAILURE,
  PartialCorrection,
  Progression,
  Slide,
  SUCCESS,
  Meta,
  Lesson,
  LessonType,
  ResourceMimeType,
} from '../progression-engine';

export type {ChapterRule} from '../progression-engine';

export * from './recommendations';

export const CONTENT_TYPE: {
  [key: string]: ContentType;
} = {
  CHAPTER: 'chapter',
  LEVEL: 'level',
  SLIDE: 'slide',
};

export const VIDEO_TRACK_KIND: {
  CAPTIONS: 'captions';
  THUMBNAILS: 'thumbnails';
} = {
  CAPTIONS: 'captions',
  THUMBNAILS: 'thumbnails',
};

export const VIDEO_TRACK_TYPE: {
  SRT: 'srt';
  VTT: 'vtt';
} = {
  SRT: 'srt',
  VTT: 'vtt',
};

export type Url = string;
export type AspectRatio = '16:9' | '4:3';

export type SlideAPI = Slide;

export type LessonAPI = Lesson;

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

export type ResourceTypeAPI = LessonType;

export type Source = {
  _id: string;
  mimeType: ResourceMimeType;
  url: Url;
};

export type ResourceAPI = {
  _id: string;
  ref: string;
  type: ResourceTypeAPI;
  mimeType: ResourceMimeType;
  mediaUrl: Url;
  src?: Array<Source>;
  description?: string;
  poster?: Url;
  subtitles?: Array<string>;
  posters?: Array<Url>;
  jwpOptions?: JwPlayerOptions;
};

export type MediaViewedEvent = {
  event: 'mediaViewed';
  mediaType: string;
  location: string;
};

export type StartProgressionEvent = {
  event: 'startProgression';
  startProgression: {
    type: string;
  };
};

export type FinishProgressionEvent = {
  event: 'finishProgression';
  progression?: {
    type: string;
    state: string;
    extraLife: number;
  };
};

export type UpdateProgressionEvent = {
  event: 'updateProgression';
  progression?: {
    type: string;
    state: string;
    extraLife: number;
  };
};

export type DataEvent =
  | MediaViewedEvent
  | StartProgressionEvent
  | FinishProgressionEvent
  | UpdateProgressionEvent;

// eslint-disable-next-line no-shadow
export type Window = {
  dataLayer?: Array<DataEvent>;
};

export type Media = {
  type?: string;
  description?: string;
  mimeType?: ResourceMimeType;
  _id?: string;
  mediaUrl?: Url;
  subtitles?: Array<string>;
  posters?: Array<Url>;
  src?: Array<Source>;
};

export type RecommendationAPI = {
  view: string;
  image: Url;
  time: string;
  type: string;
  title: string;
  author: string;
  cta: string;
  href: string;
};

export type Poster = {
  type?: string;
  mimeType?: ResourceMimeType;
  mediaUrl?: Url;
  subtitles?: Array<string>;
  posters?: Array<Url>;
  src?: Array<Source>;
};

export type Stats = {
  userTriesCount: number;
  userDoneCount: number;
};

export type LevelAPI = {
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
  external_refs: Array<string | null | undefined>;
};

export type ChapterAPI = {
  _id: string;
  universalRef: string;
  name: string;
  stars: number;
  freeRun: boolean;
  meta: Meta;
  poster: Poster;
  isConditional: boolean;
  time: number;
  version: string;
};

export type ClueAPI = string;

export type UserAnswerAPI = {
  answer: Answer;
  content: Content;
};

export type PartialPayload = {godMode: boolean; fastSlide: boolean};
export type CorrectionAPI = {
  correctAnswer: Array<Answer>;
  corrections: Array<PartialCorrection>;
};

export type ExitNodeRef = 'successExitNode' | 'failureExitNode' | string;
export type ExitNodeType = SUCCESS | FAILURE;

export type ExitNodeAPI = {
  ref: ExitNodeRef;
  type: ExitNodeType;
  meta: Meta;
  title?: string;
  description?: string;
  media: Media;
};

export type RestrictedResourceType = 'level' | 'chapter' | 'slide';

export type VideoProvider = 'jwplayer' | 'kontiki' | 'vimeo' | 'omniPlayer' | 'youtube';

export type VideoTrack = {
  kind: $Values<typeof VIDEO_TRACK_KIND>;
  file: string;
  label?: string;
  default?: boolean;
};

export type VideoTrackType = $Values<typeof VIDEO_TRACK_TYPE>;

// Keep it no strict because we can extend it
export type DataLayer = {
  getAllProgressions: () => Promise<Array<Progression>>;
  getChapterRulesByContent: (ref: string) => Array<ChapterRule>;
  getClue: (slideId: string) => Promise<ClueAPI | void>;
  getCorrectAnswer: (slideId: string) => Promise<Array<Answer>>;
  getExitNode: (ref: string) => Promise<ExitNodeAPI>;
  getNextChapter: (ref: string) => Promise<ChapterAPI | void>;
  getNextLevel: (ref: string) => Promise<LevelAPI | void>;
  findChapterById: (contentRef: string) => Promise<ChapterAPI>;
  findContent: (
    type: RestrictedResourceType,
    ref: string,
  ) => Promise<ChapterAPI | LevelAPI | Slide | void>;
  findLevelById: (contentRef: string) => Promise<LevelAPI | void>;
  findProgressionById: (id: string) => Promise<Progression | void>;
  findRecommendations: (type: string, ref: string) => Promise<Array<RecommendationAPI>>;
  findSlideByChapter: (chapterRef: string) => Promise<Array<Slide>>;
  findSlideById: (id: string) => Promise<Slide>;
  saveProgression: (arg0: Progression) => Promise<Progression>;
  findVideoUriById: (id: string, provider: VideoProvider) => Promise<string>;
  findVideoTracksById: (id: string, type?: VideoTrackType) => Promise<Array<VideoTrack>>;
};
