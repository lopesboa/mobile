export type {
  Chapter,
  Clue,
  Correction,
  ExitNode,
  ExitNodeRef,
  Level,
  Lives,
  Recommendation,
  Resource,
  UserAnswer,
  Discipline,
  VideoProvider,
  VideoTrack,
  VideoTrackType,
} from './definitions/models';

export type {ReduxState} from './definitions/redux';

export type {FindCorrection, AnswersService} from './definitions/services/answers';
export type {FindById as FindClueById, CluesService} from './definitions/services/clues';
export type {GetInfo, ContentService} from './definitions/services/content';
export type {
  FindById as FindExitNodeById,
  ExitNodesService,
} from './definitions/services/exit-nodes';
export type {
  AcceptExtraLife,
  CreateProgression,
  FindBestOf,
  FindById as FindProgressionById,
  GetAvailableContent,
  MarkResourceAsViewed,
  PostAnswer,
  RefuseExtraLife,
  RequestClue,
  ProgressionsService,
} from './definitions/services/progressions';
export type {
  FindRecommendations,
  GetNextRecommendation,
  RecommendationsService,
} from './definitions/services/recommendations';
export type {FindById as FindSlideById, SlidesService} from './definitions/services/slides';
export type {FindUriById as FindVideoUriById, VideosService} from './definitions/services/videos';
export type {Services} from './definitions/services';

export type {UiCurrentState} from './reducers/ui/current';
export type {DataProgressionState} from './reducers/data/progressions';
