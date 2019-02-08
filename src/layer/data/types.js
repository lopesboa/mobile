// @flow strict

import type {
  SlideAPI,
  ChapterAPI,
  ExitNodeAPI,
  LessonAPI,
  LevelAPI,
  ChapterRule
} from '@coorpacademy/player-services';

export type Lesson = $Exact<{|
  ...LessonAPI,
  downloadUrl?: string
|}>;

export type MimeType =
  | 'video/mp4'
  | 'application/vimeo'
  | 'image/jpeg'
  | 'image/png'
  | 'application/pdf'
  | 'application/vimeo';

export type Language = 'fr' | 'en';

type Skill = string;
type Group = string;
type Condition = string;
type Partner = string;

type Stat = {|
  userTriesCount: number,
  userDoneCount: number
|};

type Url = string;

type Meta = {
  taggedNewUntil?: string,
  updatedAt: string,
  createdAt: string
};
type Source = {|
  _id: string,
  mimeType: MimeType,
  url: Url
|};

type Poster = {|
  type?: string,
  mimeType?: MimeType,
  mediaUrl?: Url,
  subtitles?: Array<string>,
  posters?: Array<Url>,
  src?: Array<Source>
|};

export type Level = $Exact<{|
  ...LevelAPI,
  _id: string,
  deliverCoachStatus: boolean,
  taggedNewUntil: string
|}>;

export type Chapter = $Exact<{|
  ...ChapterAPI,
  universalRef: string,
  version: string,
  time: number,
  groups: Array<Group>,
  skills: Array<Skill>,
  stars: number,
  hidden: boolean,
  poster: Poster,
  __v: number,
  _id: string,
  isConditional: boolean,
  isStandalone: boolean,
  name: string,
  partners: Array<Partner>
|}>;

type Author = string;

export type Slide = $Exact<{|
  ...SlideAPI,
  lessons: Array<Lesson>,
  __v: number,
  clue?: string,
  universalRef: string,
  authors: Array<Author>
|}>;

export type ExitNode = $Exact<{
  ...ExitNodeAPI,
  ref: string,
  __v: number,
  _id: string
}>;

export type RestrictedResourceType = 'level' | 'chapter' | 'slide';
export type ResourceType = 'chapterRule' | 'discipline' | 'exitNode' | RestrictedResourceType;

type ExtentedMedia = {|
  type?: string,
  mimeType?: MimeType,
  mediaUrl?: Url,
  subtitles: Array<string>,
  posters: Array<string>,
  src: Array<string>
|};
type Cover = {|
  description: string,
  media: ExtentedMedia
|};

export type Discipline = {|
  _id: string,
  ref: string,
  universalRef: string,
  name: string,
  partnershipType: string,
  deliverCoachStatus?: boolean,
  hidden: boolean,
  __v: number,
  position: number,
  conditions: Array<Condition>,
  skills: Array<Skill>,
  groups: Array<Group>,
  stats: Stat,
  meta: Meta,
  partners: Array<Partner>,
  modules: Array<Level>,
  cover?: Cover,
  version: string
|};

export type BundledDiscipline = {|
  disciplines: {[key: string]: Discipline},
  chapters: {[key: string]: Chapter},
  exitNodes: {[key: string]: ExitNode},
  slides: {[key: string]: Slide},
  chapterRules: {[key: string]: ChapterRule}
|};
export type Resource = Slide | Discipline | Chapter | ExitNode;
