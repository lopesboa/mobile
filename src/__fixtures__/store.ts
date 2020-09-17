/* eslint-disable import/max-dependencies*/

import type {
  Level as LevelStore,
  Chapter as ChapterStore,
  Discipline as DisciplineStore,
  ExitNode as ExitNodeStore,
  VideoTrack,
} from '../types/coorpacademy/player-store';
import type {
  Slide as SlideEngine,
  Progression,
  Answer,
  EngineConfig,
} from '../types/coorpacademy/progression-engine';
import type {
  SlideAPI,
  ChapterAPI,
  LevelAPI,
  ExitNodeAPI,
} from '../types/coorpacademy/player-services';

import type {Section, Brand, PermissionStatus, User, ErrorType, NetworkState} from '../types';
import type {
  Level,
  Slide,
  Chapter,
  Discipline,
  DisciplineCard,
  ChapterCard,
  ExitNode,
} from '../layer/data/_types';
import type {StoreState, DataState, UiState} from '../redux/store';
import type {State as AuthenticationState} from '../redux/reducers/authentication';
import type {State as CatalogState} from '../redux/reducers/catalog';
import type {State as ErrorsState} from '../redux/reducers/ui/errors';
import type {State as SelectState} from '../redux/reducers/ui/select';
import type {State as AnswersState} from '../redux/reducers/ui/answers';
import type {State as SearchState} from '../redux/reducers/ui/search';
import type {State as GodModeState} from '../redux/reducers/god-mode';
import type {State as NavigationState} from '../redux/reducers/navigation';
import type {State as FastSlideState} from '../redux/reducers/fast-slide';
import type {State as AppSessionState} from '../redux/reducers/app-session';
import type {State as PermissionsState} from '../redux/reducers/permissions';
import type {State as NotitificationsState} from '../redux/reducers/notifications';
import type {State as ProgressionsState} from '../redux/reducers/progressions/synchronize';
import type {State as VideoState} from '../redux/reducers/video';
import {NOTIFICATION_SETTINGS_STATUS} from '../const';
import {
  mapToLevel,
  mapToSlide,
  mapToChapter,
  mapToDiscipline,
  mapToExitNode,
} from './utils/mappers';
import {createBrand} from './brands';
import {createUser} from './user';

type MappableObject =
  | {
      ref: string;
    }
  | {universalRef: string}
  | {_id: string};

const reduceToMappedObject = <T extends MappableObject>(
  accumulator: {
    [key: string]: T;
  },
  currentValue: T,
) => {
  if (typeof currentValue.ref === 'string') {
    return {
      ...accumulator,
      [currentValue.ref]: currentValue,
    };
  }

  if (typeof currentValue.universalRef === 'string') {
    return {
      ...accumulator,
      [currentValue.universalRef]: currentValue,
    };
  }

  if (typeof currentValue._id === 'string') {
    return {
      ...accumulator,
      [currentValue._id]: currentValue,
    };
  }
  return {
    ...accumulator,
  };
};

export const createMapObject = <T extends MappableObject>(
  items: Array<T>,
): {
  [key: string]: T;
} => {
  return items.reduce(reduceToMappedObject, {});
};

export const createCatalogState = ({
  heroRef,
  sections = [],
  cards = [],
}: {
  heroRef?: string;
  searchRef?: Array<string | void>;
  sections?: Array<Section | void>;
  cards?: Array<DisciplineCard | ChapterCard | void>;
}): CatalogState => ({
  heroRef,
  sectionsRef:
    sections && sections.length > 1
      ? sections.map((section) => (section ? section.key : undefined))
      : undefined,
  searchRef:
    cards && cards.length > 1
      ? cards.map((card) => (card ? card.universalRef : undefined))
      : undefined,
  entities: {
    sections: sections.reduce((result, section) => {
      if (section) {
        return {...result, [section.key]: {en: section}};
      }
      return result;
    }, {}),
    cards: cards.reduce((result, card) => {
      if (card) {
        return {...result, [card.universalRef]: {en: card}};
      }
      return result;
    }, {}),
  },
});

export const createAuthenticationState = ({
  token,
  brand,
  user,
}: {
  token?: string | null;
  brand?: Brand | null;
  user?: User | null;
}): AuthenticationState => ({
  token: token !== undefined ? token : '__TOKEN__',
  user: user !== undefined ? user : createUser(),
  brand: brand !== undefined ? brand : createBrand({}),
});

export const createProgressionsState = ({
  isSynchronizing = false,
}: {
  isSynchronizing: boolean;
}): ProgressionsState => ({
  isSynchronizing: false,
});

export const createUiState = ({answers = {}}: {answers?: Pick<UiState, 'answers'>}): UiState => ({
  answers,
  coaches: {
    availableCoaches: 0,
  },
  comments: {
    text: null,
  },
  corrections: {
    accordion: [false, false, false],
    playResource: 'foo',
  },
  current: {
    progressionId: 'progression1',
  },
  route: {},
});

export const createDataState = ({
  answers = [],
  levels = [],
  slides = [],
  chapters = [],
  clue,
  disciplines = [],
  exitNodes = [],
  progression,
  nextContent,
  configs = {},
  videos = {},
}: {
  answers?: Answer;
  levels?: Array<Level>;
  slides?: Array<Slide>;
  chapters?: Array<Chapter>;
  disciplines?: Array<Discipline>;
  exitNodes?: Array<ExitNode>;
  clue?: string;
  progression: Progression;
  nextContent?: SlideAPI | ChapterAPI | LevelAPI | ExitNodeAPI;
  configs?: {
    [key: string]: EngineConfig;
  };
  videos?: {
    [key: string]: {uri: string; tracks?: Array<VideoTrack>};
  };
}): DataState => {
  const _levels: {
    [key: string]: LevelStore;
  } = createMapObject(levels.map(mapToLevel));
  const _slides: {
    [key: string]: SlideEngine;
  } = createMapObject(slides.map(mapToSlide));
  const _chapters: {
    [key: string]: ChapterStore;
  } = createMapObject(chapters.map(mapToChapter));
  const _disciplines: {
    [key: string]: DisciplineStore;
  } = createMapObject(disciplines.map(mapToDiscipline));
  // @ts-ignore union type successExitNode and failureExitNode
  const _exitNodes: {
    [key: string]: ExitNodeStore;
  } = createMapObject(exitNodes.map(mapToExitNode));
  const _answers =
    answers && progression._id && slides[0]
      ? {
          [progression._id]: {
            [slides[0]._id]: {
              correctAnswer: [answers],
              corrections: answers.concat(['Foo bar']).map((answer) => ({
                answer: answer,
                isCorrect: answer !== 'Foo bar',
              })),
            },
          },
        }
      : {};
  const _clues =
    clue && progression._id && slides[0]
      ? {
          [progression._id]: {
            [slides[0]._id]: clue,
          },
        }
      : {};

  return {
    answers: {
      entities: _answers,
    },
    comments: {
      entities: {},
    },
    configs: {
      entities: configs,
    },
    contents: {
      level: {
        entities: _levels,
      },
      slide: {
        entities: _slides,
      },
      chapter: {
        entities: _chapters,
      },
      discipline: {
        entities: _disciplines,
      },
    },
    videos: {
      entities: videos,
    },
    clues: {
      entities: _clues,
    },
    exitNodes: {
      entities: _exitNodes,
    },
    progressions: {
      entities: {
        progression1: progression,
      },
    },
    rank: {},
    recommendations: {
      entities: {},
    },
    nextContent: {
      entities: {
        progression1: nextContent,
      },
    },
  };
};

export const createErrorsState = ({
  isVisible = false,
  type,
}: {
  isVisible?: boolean;
  type?: ErrorType;
}): ErrorsState<void> => ({
  isVisible,
  type,
});

export const createSelectState = ({id}: {id?: string}): SelectState =>
  id !== undefined ? id : null;

export const createAnswersState = ({isValidating}: {isValidating?: boolean}): AnswersState =>
  isValidating !== undefined ? isValidating : false;

export const createSearchState = ({
  isFetching = false,
  value,
}: {
  isFetching?: boolean;
  value?: string;
}): SearchState => ({
  isFetching,
  value,
});

export const createNavigationState = (): NavigationState => ({
  currentNavigatorName: 'dummyNavigatorName',
  currentAppScreenName: 'dummycurrentAppScreenName',
  currentScreenName: 'dummyScreenName',
  currentTabName: 'dummyTabName',
});

export const createPermissionsState = ({
  camera = 'undetermined',
  notifications = 'undetermined',
}: {
  camera?: PermissionStatus;
  notifications?: PermissionStatus;
}): PermissionsState => ({
  camera,
  notifications,
});

export const createNotificationsState = (
  notification = {
    'finish-course': {
      label: 'Weekly Reminder',
      status: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
    },
    suggestion: {
      label: 'You might like it',
      status: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
    },
  },
): NotitificationsState => ({
  settings: {
    ...notification,
  },
});

export const createVideoState = ({isFullScreen = false}: {isFullScreen?: boolean}): VideoState => ({
  isFullScreen,
});

export const createNetworkState = ({
  isConnected = true,
}: {
  isConnected?: boolean;
}): NetworkState => ({
  isConnected,
  actionQueue: [],
  isQueuePaused: false,
});

export const createStoreState = ({
  levels,
  slides,
  chapters,
  disciplines,
  exitNodes,
  videos,
  progression,
  catalog,
  data,
  ui,
  authentication,
  nextContent,
  godMode = false,
  fastSlide = false,
  appSession = 0,
  errors,
  select,
  isValidating,
  search,
  navigation,
  permissions,
  notifications,
  progressions,
  video,
  network,
}: {
  levels?: Array<Level>;
  slides?: Array<Slide>;
  chapters?: Array<Chapter>;
  disciplines?: Array<Discipline>;
  exitNodes?: Array<ExitNode>;
  videos?: {
    [key: string]: {uri: string; tracks?: Array<VideoTrack>};
  };
  progression: Progression;
  data?: DataState;
  ui?: UiState;
  authentication?: AuthenticationState;
  catalog?: CatalogState;
  nextContent?: SlideAPI | ChapterAPI | LevelAPI | ExitNodeAPI;
  godMode?: GodModeState;
  fastSlide?: FastSlideState;
  appSession?: AppSessionState;
  errors?: ErrorsState<void>;
  select?: SelectState;
  isValidating?: AnswersState;
  search?: SearchState;
  navigation?: NavigationState;
  permissions?: PermissionsState;
  notifications?: NotitificationsState;
  progressions?: ProgressionsState;
  video?: VideoState;
  network?: NetworkState;
}): StoreState => ({
  data:
    data ||
    createDataState({
      levels,
      slides,
      chapters,
      disciplines,
      exitNodes,
      progression,
      nextContent,
      videos,
    }),
  ui: ui || createUiState({}),
  errors: errors || createErrorsState({}),
  select: select || createSelectState({}),
  isValidating: isValidating || createAnswersState({}),
  search: search || createSearchState({}),
  navigation: navigation || createNavigationState(),
  catalog: catalog || createCatalogState({}),
  permissions: permissions || createPermissionsState({}),
  authentication: authentication || createAuthenticationState({}),
  progressions: progressions || createProgressionsState({}),
  notifications: notifications || createNotificationsState(),
  godMode,
  fastSlide,
  appSession,
  video: video || createVideoState({}),
  network: network || createNetworkState({}),
});
