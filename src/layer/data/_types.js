// @flow strict

import type {
  SlideAPI,
  ChapterAPI,
  ExitNodeAPI,
  LessonAPI,
  LevelAPI,
  ChapterRule
} from '@coorpacademy/player-services';

import type {Discipline as DisciplineStore} from '@coorpacademy/player-store';

export type Lesson = $Exact<{|
  ...LessonAPI,
  downloadUrl?: string,
  mediaRef?: string
|}>;

export type MimeType =
  | 'video/mp4'
  | 'application/vimeo'
  | 'image/jpeg'
  | 'image/png'
  | 'application/pdf'
  | 'application/vimeo';

type Skill = string;
type Group = string;

type Partner = string;

type Url = string;

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
  taggedNewUntil: string,
  name: string,
  levelTranslation: string
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
  universalRef: string,
  authors: Array<Author>
|}>;

export type ExitNode = $Exact<{
  ...ExitNodeAPI,
  ref: string,
  __v: number,
  _id: string
}>;

export type RestrictedResourceType = 'level' | 'chapter' | 'slide' | 'discipline';
export type ResourceType = 'chapterRule' | 'exitNode' | RestrictedResourceType;

export type ExtentedMedia = {|
  type?: string,
  mimeType?: MimeType,
  mediaUrl?: Url,
  subtitles: Array<string>,
  posters: Array<string>,
  src: Array<string>
|};

export type Discipline = $Exact<{|
  ...DisciplineStore,
  modules: Array<Level>
|}>;

export type BundledDiscipline = {|
  disciplines: {[key: string]: Discipline},
  // $FlowFixMe dont understand "looks promising" from Flow
  chapters: {[key: string]: Chapter},
  exitNodes: {[key: string]: ExitNode},
  slides: {[key: string]: Slide},
  chapterRules: {[key: string]: ChapterRule}
|};
export type Resource = Slide | Discipline | Chapter | ExitNode;
