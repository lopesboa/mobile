// @flow strict

import type {
  SlideAPI,
  ChapterAPI,
  ExitNodeAPI,
  LessonAPI,
  LevelAPI,
  ChapterRule
} from '@coorpacademy/player-services';

import type {Context} from '@coorpacademy/progression-engine';
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

export type LevelType = 'base' | 'advanced' | 'coach';

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
  authors: Array<Author>,
  context: Context
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

export type CardThematique = {|
  ref: string,
  label: string
|};
export type CardSkill = {|
  ref: string,
  name: string
|};
export type CardAuthor = {|
  ref: string,
  label: string,
  authorType: string
|};
export type CardType = 'course' | 'chapter';
export type CardStatus = 'isStarted' | 'isLocked' | 'isActive';
export type CardLevel = {|
  nbChapters: number,
  ref: string,
  universalRef: string,
  version: string,
  level: LevelType,
  creditsToAccess: number,
  isConditional: boolean,
  taggedNewUntil: string,
  stars: number,
  inProgress: boolean,
  isDone: boolean,
  completion: number,
  accessible: boolean,
  status: CardStatus,
  label: string
|};
// @todo add properties to use
export type CardCondition = {||};

export type Card<T> = {|
  ...T,
  type: CardType,
  image: string,
  time: number,
  adaptiv: boolean,
  certification: boolean,
  lang: string,
  thematiques: Array<CardThematique>,
  skills: Array<CardSkill>,
  groupsHidden: string,
  // @todo to be enhanced
  course: null,
  authors: Array<CardAuthor>,
  authorsListHidden: string,
  title: string,
  position: number,
  createdAt: string,
  taggedNewUntil: string,
  ref: string,
  universalRef: string,
  version: string,
  relatedContentHidden: string,
  // @todo to be enhanced
  _score: number | null,
  stars: number,
  completion: number,
  isNew: boolean,
  favorite: boolean
|};

export type DisciplineCard = Card<{|
  type: 'course',
  conditions: Array<CardCondition>,
  defaultModuleLevel: LevelType,
  descriptionHidden: string,
  modules: Array<CardLevel>,
  nbChapters: number,
  skillsHidden: string
|}>;

export type ChapterCard = Card<{|
  type: 'chapter',
  isStandalone: boolean,
  isFirst: boolean,
  moduleRef: string,
  creditsToAccess: number,
  inProgress: boolean,
  isDone: boolean,
  status: CardStatus,
  accessible: boolean
|}>;

export type Cards = Array<DisciplineCard | ChapterCard>;
