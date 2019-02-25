// @flow
import type {
  Level as LevelStore,
  Chapter as ChapterStore,
  Discipline as DisciplinStore
} from '@coorpacademy/player-store';
import type {Slide as SlideEngine, Progression} from '@coorpacademy/progression-engine';
import type {Level, Slide, Chapter, Discipline} from '../layer/data/_types';
import type {StoreState} from '../redux/store';
import {initialState as bundledDisciplineState} from '../redux/reducers/discipline-bundle';
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
  progression
}: {
  levels: Array<Level>,
  slides: Array<Slide>,
  chapters: Array<Chapter>,
  disciplines: Array<Discipline>,
  progression: Progression
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

  return {
    data: data,
    ui: {
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
    },
    navigation: {
      currentNavigatorName: 'dummyNavigatorName',
      currentAppScreenName: 'dummycurrentAppScreenName',
      isHidden: false,
      currentScreenName: 'dummyScreenName',
      currentTabName: 'dummyScreenName'
    },
    disciplineBundle: bundledDisciplineState
  };
};
