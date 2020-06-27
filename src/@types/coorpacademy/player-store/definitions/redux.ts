import {
    Answer,
    EngineConfig,
    Progression,
    ProgressionId,
    Slide
} from '../../progression-engine';
import { Chapter, Discipline, Level, Resource, VideoTrack } from './models';
import { Services } from './services';

type Task = Function;

type Data = {
    progressions: {
        entities: Record<string, Progression>;
    };
    configs: {
        entities: Record<string, EngineConfig>;
    };
    contents: {
        chapter: {
            entities: Record<string, Chapter>;
        };
        discipline: {
            entities: Record<string, Discipline>;
        };
        level: {
            entities: Record<string, Level>;
        };
        slide: {
            entities: Record<string, Slide>;
        };
    };
    videos: {
        entities: Record<string, { uri: string; tracks?: Array<VideoTrack> }>;
    };
};

type Ui = {
    answers: Record<string, { value: Answer }>;
    coaches: {
        availableCoaches: number;
    };
    comments: {
        text: string | null | undefined;
    };
    corrections: {
        accordion: Array<boolean>;
        playResource: string;
    };
    current: {
        progressionId: ProgressionId;
    };
    route: Record<string, 'answer' | 'correction'>;
};

// Keep it no-strict because some of apps can extend this one
type ReduxState = {
    data: Data;
    ui: Ui;
};

type GetState = () => ReduxState;

type Action = {
    task?: Task;
    bailout?: Function;
    type: string;
    meta?: {
        id?: string;
        resource?: Resource;
        location?: string;
        progressionId?: string;
        slideId?: string;
        type?: string;
        ref?: string;
        answer?: string;
    };
};

type Options = {
    services: Services;
};

type PromiseAction = Promise<Action>;

type ThunkAction = (
    arg0: Function,
    arg1: GetState,
    arg2: Options
) => Action | PromiseAction;

type DispatchedAction = Action | ThunkAction | PromiseAction;

type Dispatch = (
    action: Action | ThunkAction | PromiseAction
) => DispatchedAction;

// type ThunkAction = (dispatch: Dispatch, getState: GetState, Options) => DispatchedAction;

export type {
    Action,
    Data,
    DispatchedAction,
    Dispatch,
    GetState,
    PromiseAction,
    Options,
    ReduxState,
    Resource,
    ThunkAction,
    Ui
};
