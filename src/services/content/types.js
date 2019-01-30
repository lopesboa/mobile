// @flow strict

import type {MimeType} from '../../types';

type Answer = string;

type Meta = {|
  taggedNewUntil?: string,
  updatedAt: string,
  createdAt: string
|};

export type Language = 'fr' | 'en';
type Url = string;

type ExtentedMedia = {|
  type?: string,
  mimeType?: MimeType,
  mediaUrl?: Url,
  subtitles: Array<string>,
  posters: Array<string>,
  src: Array<string>
|};
type Skill = string;
type Group = string;
type Condition = string;
type Partner = string;
type ExitNodeRef = 'successExitNode' | 'failureExitNode' | string;
type Stat = {|
  userTriesCount: number,
  userDoneCount: number
|};
type UniversalRef = string;
type Ref = UniversalRef | string;
type DateTime = string;
type Data = Array<string>;

type Module = {|
  _id: string,
  taggedNewUntil: DateTime,
  timeAlloted: number,
  level: string,
  universalRef: Ref,
  ref: Ref,
  eligibleBattle: boolean,
  creditsToAccess: number,
  infiniteLives: boolean,
  isConditional: boolean,
  data: Array<Data>,
  stats: Stat,
  chapterIds: Array<string>,
  acquiredSkills: Array<Skill>,
  version: string,
  external_refs: Array<Ref>
|};

type Cover = {|
  description: string,
  media: ExtentedMedia
|};

export type Chapter = {|
  _id: string,
  universalRef: string,
  name: string,
  stars: number,
  freeRun: boolean,
  hidden: boolean,
  __v: number,
  meta: Meta,
  poster: ExtentedMedia,
  skills: Array<Skill>,
  groups: Array<Group>,
  partners: Array<Partner>,
  isStandalone: boolean,
  isConditional: boolean,
  time: number,
  version: string
|};

export type ExitNode = {|
  ref: ExitNodeRef,
  type: string,
  __v: number,
  _id: string,
  meta: Meta,
  media: ExtentedMedia
|};

export type Discipline = {|
  _id: string,
  ref: string,
  universalRef: string,
  name: string,
  partnershipType: string,
  hidden: boolean,
  __v: number,
  position: number,
  conditions: Array<Condition>,
  skills: Array<Skill>,
  groups: Array<Group>,
  stats: Stat,
  meta: Meta,
  partners: Array<Partner>,
  modules: Array<Module>,
  cover: Cover,
  version: string
|};

type QuestionCommon = {|
  explanation?: string,
  header?: string,
  medias?: Array<string>,
  media?: ExtentedMedia,
  medias?: Array<string>
|};

type QCMQuestion = {|
  ...{|
    type: 'qcm',
    content: {
      answers: Array<Answer>
    }
  |} & QuestionCommon
|};

type QCMGraphicQuestion = {|
  type: 'qcmGraphic',
  content: {
    answers: Array<Answer>
  }
|};

type SliderQuestion = {|
  type: 'slider',
  content: {
    answers: Answer
  }
|};

type LessonType = 'pdf' | 'video';

type QCMDragQuestion = {|
  ...{|
    type: 'qcmDrag',
    content: {
      matchOrder: boolean,
      answers: Array<Answer>
    }
  |} & QuestionCommon
|};

type BasicQuestion = {|
  type: 'basic',
  content: {
    maxTypos?: ?number,
    answers: Array<Answer>
  }
|};

type TemplateChoice = {|
  type: 'text' | 'select'
|};

type Subtitle = string;

type TemplateQuestion = {|
  type: 'template',
  content: {
    matchOrder: boolean,
    maxTypos?: ?number,
    choices: Array<TemplateChoice>,
    answers: Array<Answer>
  }
|};

type Question =
  | QCMQuestion
  | QCMGraphicQuestion
  | QCMDragQuestion
  | SliderQuestion
  | BasicQuestion
  | TemplateQuestion;

export type Lesson = {|
  _id: string,
  videoId?: string,
  mediaUrl: string,
  downloadUrl?: string,
  poster: string,
  description: string,
  mimeType: MimeType,
  ref: Ref,
  type: LessonType,
  subtitles: Array<Subtitle>,
  posters: Array<string>,
  src: Array<string>
|};

type ChapterRuleActionInstruction = {|
  field: string,
  type: string,
  value?: number
|};

type ChapterRuleAction = {|
  scope: string,
  instructions: Array<ChapterRuleActionInstruction>
|};

type Rule = {|
  ref: string,
  source?: string,
  destination: {|
    type: string,
    ref: string
  |},
  priority: number,
  actions: Array<ChapterRuleAction>
|};

type ChapterRuleConditon = {|
  target: {|
    scope: string,
    ref: string,
    field: string
  |},
  operator: string,
  values: Array<string>
|};

export type ChapterRule = {|
  ref: string,
  chapterRef: string,
  rules: Array<Rule>,
  conditions: Array<ChapterRuleConditon>
|};

export type Slide = {|
  _id: string,
  chapter_id: string,
  __v: number,
  universalRef: string,
  question: Question,
  position?: ?number,
  klf: string,
  clue: string,
  tips: string,
  meta: Meta,
  lessons: Array<Lesson>,
  authors: Array<string>,
  context: {
    media: {
      subtitles: Array<Subtitle>,
      posters: Array<string>,
      src: Array<string>
    }
  }
|};

export type BundledDiscipline = {|
  disciplines: {[key: string]: Discipline},
  chapters: {[key: string]: Chapter},
  exitNodes: {[key: string]: ExitNode},
  slides: {[key: string]: Slide},
  chapterRules: {[key: string]: ChapterRule}
|};
