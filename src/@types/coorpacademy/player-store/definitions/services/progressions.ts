import {
    AvailableContent,
    Config,
    Content,
    ContentType,
    ContentSlide,
    Engine,
    EngineConfig,
    Progression,
    ResourceContent
} from '../../../progression-engine';
import { UserAnswer } from '../models';

type AcceptExtraLife = (
    progressionId: string,
    payload: {
        content: Content;
    }
) => Promise<Progression>;

type CreateProgression = (
    arg0: string,
    arg1: Engine,
    arg2: Content,
    arg3: EngineConfig
) => Promise<Progression>;

type FindBestOf = (
    engineRef: string,
    contentType: ContentType,
    contentRef: string,
    progressionId: string
) => Promise<{ stars: number }>;
type FindById = (id: string) => Promise<Progression | void>;
type GetAvailableContent = (arg0: Content) => Promise<AvailableContent>;
type MarkResourceAsViewed = (
    progressionId: string,
    payload: {
        resource: ResourceContent;
        content: Content;
    }
) => Promise<Progression>;
type PostAnswerPartialPayload = { godMode: boolean; fastSlide: boolean };

type PostAnswer = (
    progressionId: string,
    payload: UserAnswer,
    partialPayload: PostAnswerPartialPayload
) => Promise<Progression>;
type RefuseExtraLife = (
    progressionId: string,
    payload: {
        content: Content;
    }
) => Promise<Progression>;

type RequestClue = (
    progressionId: string,
    payload: { content: ContentSlide }
) => Promise<Progression>;

type ProgressionsService = {
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

export type {
    AcceptExtraLife,
    CreateProgression,
    FindBestOf,
    FindById,
    GetAvailableContent,
    MarkResourceAsViewed,
    PostAnswer,
    RefuseExtraLife,
    RequestClue,
    ProgressionsService,
    PostAnswerPartialPayload
};
