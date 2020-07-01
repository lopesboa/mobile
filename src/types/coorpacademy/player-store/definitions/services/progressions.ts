import {
  AvailableContent,
  Config,
  Content,
  ContentType,
  ContentSlide,
  Engine,
  EngineConfig,
  Progression,
  ResourceContent,
} from '../../../progression-engine';
import {UserAnswer} from '../models';

export type AcceptExtraLife = (
  progressionId: string,
  payload: {
    content: Content;
  },
) => Promise<Progression>;

export type CreateProgression = (
  arg0: string,
  arg1: Engine,
  arg2: Content,
  arg3: EngineConfig,
) => Promise<Progression>;

export type FindBestOf = (
  engineRef: string,
  contentType: ContentType,
  contentRef: string,
  progressionId: string,
) => Promise<{stars: number}>;
export type FindById = (id: string) => Promise<Progression | void>;
export type GetAvailableContent = (arg0: Content) => Promise<AvailableContent>;
export type MarkResourceAsViewed = (
  progressionId: string,
  payload: {
    resource: ResourceContent;
    content: Content;
  },
) => Promise<Progression>;
export type PostAnswerPartialPayload = {godMode: boolean; fastSlide: boolean};

export type PostAnswer = (
  progressionId: string,
  payload: UserAnswer,
  partialPayload: PostAnswerPartialPayload,
) => Promise<Progression>;
export type RefuseExtraLife = (
  progressionId: string,
  payload: {
    content: Content;
  },
) => Promise<Progression>;

export type RequestClue = (
  progressionId: string,
  payload: {content: ContentSlide},
) => Promise<Progression>;

export type ProgressionsService = {
  acceptExtraLife: AcceptExtraLife;
  create: CreateProgression;
  findBestOf: FindBestOf;
  findById: FindById;
  getAvailableContent: GetAvailableContent;
  getEngineConfig: (arg0: Engine) => Promise<Config>;
  markResourceAsViewed: MarkResourceAsViewed;
  openAssistance: (arg0: Progression) => Progression;
  postAnswer: PostAnswer;
  refuseExtraLife: RefuseExtraLife;
  requestClue: RequestClue;
  save: (arg0: Progression) => Progression;
};
