import type {
  Answer,
  EngineConfig,
  Progression,
  ProgressionId,
  Slide,
} from '../../progression-engine';
import type {Chapter, Discipline, Level, Resource, VideoTrack} from './models';
import type {Services} from './services';

export type Task = Function;

export type Data = {
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
    entities: Record<string, {uri: string; tracks?: Array<VideoTrack>}>;
  };
};

export type Ui = {
  answers: Record<string, {value: Answer}>;
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
export type ReduxState = {
  data: Data;
  ui: Ui;
};

export type GetState = () => ReduxState;

export type Action = {
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

export type Options = {
  services: Services;
};

export type PromiseAction = Promise<Action>;

export type ThunkAction = (arg0: Function, arg1: GetState, arg2: Options) => Action | PromiseAction;

export type DispatchedAction = Action | ThunkAction | PromiseAction;

export type Dispatch = (action: Action | ThunkAction | PromiseAction) => DispatchedAction;
