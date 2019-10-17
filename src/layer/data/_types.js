// @flow strict

import type {
  SlideAPI,
  ChapterAPI,
  ExitNodeAPI,
  LevelAPI,
  ChapterRule
} from '@coorpacademy/player-services';
import type {
  Content,
  Context,
  Lesson,
  Progression,
  ProgressionId,
  ResourceMimeType
} from '@coorpacademy/progression-engine';
import type {Discipline as DisciplineStore} from '@coorpacademy/player-store';
import type {SupportedLanguage} from '../../translations/_types';

export type MimeType = ResourceMimeType;

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
  levelTranslation: string,
  bestScore?: number
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
  _id: string,
  isConditional: boolean,
  isStandalone: boolean,
  name: string,
  partners: Array<Partner>,
  bestScore?: number
|}>;

type Author = string;

export type Slide = $Exact<{|
  ...SlideAPI,
  lessons: Array<Lesson>,
  universalRef: string,
  authors: Array<Author>,
  context: Context
|}>;

export type ExitNode = $Exact<{
  ...ExitNodeAPI,
  ref: string,
  _id: string
}>;

export type RestrictedResourceType = 'level' | 'chapter' | 'slide' | 'discipline';
export type ResourceType = 'chapterRule' | 'exitNode' | 'card' | RestrictedResourceType;

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

export type BundledChapter = {|
  // $FlowFixMe dont understand "looks promising" from Flow
  chapters: {[key: string]: Chapter},
  exitNodes: {[key: string]: ExitNode},
  slides: {[key: string]: Slide},
  chapterRules: {[key: string]: ChapterRule}
|};

export type BundledDiscipline = {|
  disciplines: {[key: string]: Discipline},
  ...BundledChapter
|};

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
  authorType: 'coorp' | 'verified' | 'custom' | 'marketplace'
|};
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

export type ICard = {|
  image: string,
  time: number,
  adaptiv: boolean,
  certification: boolean,
  lang: SupportedLanguage,
  thematiques: Array<CardThematique>,
  skills: Array<CardSkill>,
  groupsHidden: string,
  // @todo to be enhanced
  course: {
    ref: string,
    label: string
  } | null,
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

export type DisciplineCard = {|
  ...ICard,
  type: 'course',
  conditions: Array<CardCondition>,
  defaultModuleLevel: LevelType,
  descriptionHidden: string,
  modules: Array<CardLevel>,
  nbChapters: number,
  skillsHidden: string
|};

export type ChapterCard = {|
  ...ICard,
  type: 'chapter',
  isStandalone: boolean,
  isFirst: boolean,
  moduleRef: string,
  creditsToAccess: number,
  inProgress: boolean,
  isDone: boolean,
  status: CardStatus,
  accessible: boolean
|};

export type CardType = $PropertyType<DisciplineCard, 'type'> | $PropertyType<ChapterCard, 'type'>;

export type Resource = Slide | Discipline | Chapter | ExitNode | ChapterCard | DisciplineCard;

export type Card = DisciplineCard | ChapterCard;

export type Cards = Array<Card>;

export type Completion = {|
  current: number,
  stars: number
|};

export type Record = {|
  content: {
    ...Progression,
    _id: ProgressionId,
    meta: {
      updatedAt: string,
      createdAt: string
    }
  }
|};

export type HeroRecommendation = {|
  success: boolean,
  content: Content,
  nbSlides: number,
  updatedAt: string,
  progressionId: string
|};
