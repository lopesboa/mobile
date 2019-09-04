// @flow

import type {
  Level as LevelStore,
  Chapter as ChapterStore,
  Discipline as DisciplineStore
} from '@coorpacademy/player-store';
import type {Slide as SlideEngine, Progression, Answer} from '@coorpacademy/progression-engine';
import type {SlideAPI, ChapterAPI, LevelAPI} from '@coorpacademy/player-services';

import type {Section, Brand} from '../types';
import type {
  Level,
  Slide,
  Chapter,
  Discipline,
  DisciplineCard,
  ChapterCard
} from '../layer/data/_types';
import type {StoreState, DataState, UiState} from '../redux/store';
import type {State as AuthenticationState} from '../redux/reducers/authentication';
import type {State as CatalogState} from '../redux/reducers/catalog';
import type {State as ErrorState} from '../redux/reducers/ui/error';
import type {State as GodModeState} from '../redux/reducers/god-mode';
import type {State as NavigationState} from '../redux/reducers/navigation';
import type {State as FastSlideState} from '../redux/reducers/fast-slide';
import type {State as PermissionsState} from '../redux/reducers/permissions';
import type {State as VideoState} from '../redux/reducers/video';
import {mapToLevel, mapToSlide, mapToChapter, mapToDiscipline} from './utils/mappers';
import {createBrand} from './brands';

type MappableObject =
  | {
      ref: string
    }
  | {universalRef: string}
  | {_id: string};

const reduceToMappedObject = <T: MappableObject>(
  accumulator: {[key: string]: T},
  currentValue: T
) => {
  if (typeof currentValue.ref === 'string') {
    return {
      ...accumulator,
      [currentValue.ref]: currentValue
    };
  }

  if (typeof currentValue.universalRef === 'string') {
    return {
      ...accumulator,
      [currentValue.universalRef]: currentValue
    };
  }

  if (typeof currentValue._id === 'string') {
    return {
      ...accumulator,
      [currentValue._id]: currentValue
    };
  }
  return {
    ...accumulator
  };
};

export const createMapObject = <T: MappableObject>(items: Array<T>): {[key: string]: T} => {
  return items.reduce(reduceToMappedObject, {});
};

export const createCatalogState = (
  sections?: Array<Section | void> = [],
  cards?: Array<DisciplineCard | ChapterCard> = []
): CatalogState => ({
  sectionsRef: sections.map(section => (section ? section.key : undefined)),
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
    }, {})
  }
});

export const createAuthenticationState = ({
  brand
}: {
  brand?: Brand | null
}): AuthenticationState => ({
  user: {
    token: '__TOKEN__',
    isGodModeUser: false
  },
  brand: brand !== undefined ? brand : createBrand({})
});

export const createUiState = ({
  answers = {}
}: {
  answers?: $PropertyType<UiState, 'answers'>
}): UiState => ({
  answers,
  coaches: {
    availableCoaches: 0
  },
  comments: {
    text: null
  },
  corrections: {
    accordion: [false, false, false],
    playResource: ''
  },
  current: {
    progressionId: 'progression1'
  },
  route: {}
});

export const createDataState = ({
  answers,
  levels,
  slides,
  chapters,
  disciplines,
  progression,
  nextContent
}: {
  answers?: Answer,
  levels: Array<Level>,
  slides: Array<Slide>,
  chapters: Array<Chapter>,
  disciplines: Array<Discipline>,
  progression: Progression,
  nextContent?: SlideAPI | ChapterAPI | LevelAPI
}): DataState => {
  const _levels: {[key: string]: LevelStore} = createMapObject(levels.map(mapToLevel));
  const _slides: {[key: string]: SlideEngine} = createMapObject(slides.map(mapToSlide));
  const _chapters: {[key: string]: ChapterStore} = createMapObject(chapters.map(mapToChapter));
  const _disciplines: {[key: string]: DisciplineStore} = createMapObject(
    disciplines.map(mapToDiscipline)
  );
  const _answers =
    answers && progression._id && slides[0]
      ? {
          [progression._id]: {
            [slides[0]._id]: {
              correctAnswer: [answers],
              corrections: answers.concat(['Foo bar']).map(answer => ({
                answer: answer,
                isCorrect: answer !== 'Foo bar'
              }))
            }
          }
        }
      : {};

  return {
    answers: {
      entities: _answers
    },
    comments: {
      entities: {}
    },
    configs: {
      entities: {}
    },
    contents: {
      level: {
        entities: _levels
      },
      slide: {
        entities: _slides
      },
      chapter: {
        entities: _chapters
      },
      discipline: {
        entities: _disciplines
      }
    },
    videos: {
      entities: {}
    },
    clues: {
      entities: {}
    },
    exitNodes: {
      entities: {}
    },
    progressions: {
      entities: {
        progression1: progression
      }
    },
    rank: {},
    recommendations: {
      entities: {}
    },
    nextContent: {
      entities: {
        progression1: nextContent
      }
    }
  };
};

export const createErrorState = ({isVisible = false}: {isVisible?: boolean}): ErrorState<void> => ({
  isVisible
});

export const createNavigationState = (): NavigationState => ({
  currentNavigatorName: 'dummyNavigatorName',
  currentAppScreenName: 'dummycurrentAppScreenName',
  currentScreenName: 'dummyScreenName',
  currentTabName: 'dummyTabName'
});

export const createPermissionsState = (): PermissionsState => ({
  camera: undefined
});

export const createVideoState = (): VideoState => ({
  isFullScreen: false
});

export const createStoreState = ({
  levels,
  slides,
  chapters,
  disciplines,
  progression,
  catalog,
  data,
  ui,
  authentication,
  nextContent,
  godMode = false,
  fastSlide = false,
  error,
  navigation,
  permissions,
  video
}: {
  levels: Array<Level>,
  slides: Array<Slide>,
  chapters: Array<Chapter>,
  disciplines: Array<Discipline>,
  progression: Progression,
  data?: DataState,
  ui?: UiState,
  authentication?: AuthenticationState,
  catalog?: CatalogState,
  nextContent?: SlideAPI | ChapterAPI | LevelAPI,
  godMode?: GodModeState,
  fastSlide?: FastSlideState,
  error?: ErrorState<void>,
  navigation?: NavigationState,
  permissions?: PermissionsState,
  video?: VideoState
}): StoreState => ({
  data:
    data ||
    createDataState({
      levels,
      slides,
      chapters,
      disciplines,
      progression,
      nextContent
    }),
  ui: ui || createUiState({}),
  error: error || createErrorState({}),
  navigation: navigation || createNavigationState(),
  catalog: catalog || createCatalogState(),
  permissions: permissions || createPermissionsState(),
  authentication: authentication || createAuthenticationState({}),
  godMode,
  fastSlide,
  video: video || createVideoState()
});
