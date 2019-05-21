// @flow
import type {
  Level as LevelStore,
  Chapter as ChapterStore,
  Discipline as DisciplinStore
} from '@coorpacademy/player-store';
import type {Slide as SlideEngine, Progression} from '@coorpacademy/progression-engine';
import type {Level, Slide, Chapter, Discipline} from '../layer/data/_types';
import type {StoreState} from '../redux/store';
import {initialState as bundleState} from '../redux/reducers/bundle';
import {initialState as cardsState} from '../redux/reducers/cards';
import type {State as CardsState} from '../redux/reducers/cards';
import {initialState as permissionsState} from '../redux/reducers/permissions';
import {mapToLevel, mapToSlide, mapToChapter, mapToDiscipline} from './utils/mappers';

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

export const createStoreState = ({
  levels,
  slides,
  chapters,
  disciplines,
  progression,
  cards,
  data: baseData,
  ui: baseUi
}: {
  levels: Array<Level>,
  slides: Array<Slide>,
  chapters: Array<Chapter>,
  disciplines: Array<Discipline>,
  progression: Progression,
  // @todo type this later, im so sorry
  // eslint-disable-next-line flowtype/no-weak-types
  data?: any,
  // eslint-disable-next-line flowtype/no-weak-types
  ui?: any,
  cards?: CardsState
}): StoreState => {
  const mappedLevel: {[key: string]: LevelStore} = createMapObject(levels.map(mapToLevel));
  const mappedSlide: {[key: string]: SlideEngine} = createMapObject(slides.map(mapToSlide));
  const mappedChapter: {[key: string]: ChapterStore} = createMapObject(chapters.map(mapToChapter));
  const mappedDisciplines: {[key: string]: DisciplinStore} = createMapObject(
    disciplines.map(mapToDiscipline)
  );

  const data = {
    answers: {
      entities: {}
    },
    comments: {
      entities: {}
    },
    configs: {
      entities: {}
    },
    contents: {
      level: {
        entities: mappedLevel
      },
      slide: {
        entities: mappedSlide
      },
      chapter: {
        entities: mappedChapter
      },
      discipline: {
        entities: mappedDisciplines
      }
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
      entities: {}
    }
  };

  const ui = {
    answers: {},
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
  };
  return {
    data: (baseData && {...data, ...baseData}) || data,
    ui: (baseUi && {...ui, ...baseUi}) || ui,
    error: {
      isVisible: false
    },
    navigation: {
      currentNavigatorName: 'dummyNavigatorName',
      currentAppScreenName: 'dummycurrentAppScreenName',
      currentScreenName: 'dummyScreenName',
      currentTabName: 'dummyScreenName'
    },
    bundle: bundleState,
    cards: cards || cardsState,
    permissions: permissionsState,
    authentication: {
      user: {
        token: '__TOKEN__',
        isGodModeUser: false
      },
      brand: null
    },
    godmode: false,
    video: {
      isFullScreen: false
    }
  };
};
