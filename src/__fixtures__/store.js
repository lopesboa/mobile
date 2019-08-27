// @flow
import type {
  Level as LevelStore,
  Chapter as ChapterStore,
  Discipline as DisciplinStore
} from '@coorpacademy/player-store';
import type {Slide as SlideEngine, Progression} from '@coorpacademy/progression-engine';
import type {SlideAPI, ChapterAPI, LevelAPI} from '@coorpacademy/player-services';

import type {Section} from '../types';
import type {
  Level,
  Slide,
  Chapter,
  Discipline,
  DisciplineCard,
  ChapterCard
} from '../layer/data/_types';
import type {StoreState} from '../redux/store';
import type {State as CatalogState} from '../redux/reducers/catalog';
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

export const createStoreState = ({
  levels,
  slides,
  chapters,
  disciplines,
  progression,
  catalog,
  godmode: baseGodMode,
  fastSlide: basefastSlide,
  data: baseData,
  ui: baseUi,
  authentication: baseAuthentication,
  nextContent
}: {
  levels: Array<Level>,
  slides: Array<Slide>,
  chapters: Array<Chapter>,
  disciplines: Array<Discipline>,
  progression: Progression,
  godmode?: boolean,
  fastSlide?: boolean,
  // @todo type this later, im so sorry
  // eslint-disable-next-line flowtype/no-weak-types
  data?: any,
  // eslint-disable-next-line flowtype/no-weak-types
  ui?: any,
  // eslint-disable-next-line flowtype/no-weak-types
  authentication?: any,
  catalog?: CatalogState,
  nextContent?: SlideAPI | ChapterAPI | LevelAPI
}): StoreState => {
  const mappedLevel: {[key: string]: LevelStore} = createMapObject(levels.map(mapToLevel));
  const mappedSlide: {[key: string]: SlideEngine} = createMapObject(slides.map(mapToSlide));
  const mappedChapter: {[key: string]: ChapterStore} = createMapObject(chapters.map(mapToChapter));
  const mappedDisciplines: {[key: string]: DisciplinStore} = createMapObject(
    disciplines.map(mapToDiscipline)
  );

  const godmode = baseGodMode || false;
  const fastSlide = basefastSlide || false;

  const authentication = baseAuthentication || {
    user: {
      token: '__TOKEN__',
      isGodModeUser: false
    },
    brand: null
  };

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
    catalog: catalog || createCatalogState(),
    permissions: permissionsState,
    authentication,
    godmode,
    fastSlide,
    video: {
      isFullScreen: false
    }
  };
};
