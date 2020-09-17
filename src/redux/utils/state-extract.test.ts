import type {Content} from '@coorpacademy/progression-engine';
import {ROLES} from '@coorpacademy/acl';

import type {Slide, DisciplineCard, ChapterCard} from '../../layer/data/_types';
import {CARD_STATUS} from '../../layer/data/_const';
import type {Engine, ProgressionEngineVersions, Section, Brand, User} from '../../types';
import {
  ENGINE,
  CONTENT_TYPE,
  SPECIFIC_CONTENT_REF,
  PERMISSION_STATUS,
  ERROR_TYPE,
} from '../../const';
import {createBrand} from '../../__fixtures__/brands';
import {createUser} from '../../__fixtures__/user';
import {createToken} from '../../__fixtures__/tokens';
import {createLevel} from '../../__fixtures__/levels';
import {
  createProgression,
  createState as createProgressionState,
} from '../../__fixtures__/progression';
import {createChapter} from '../../__fixtures__/chapters';
import {createSlide} from '../../__fixtures__/slides';
import {createSections} from '../../__fixtures__/sections';
import {createTemplate} from '../../__fixtures__/questions';
import {createContextWithPDF, createContextWithImage} from '../../__fixtures__/context';
import {createDisciplineCard, createChapterCard, createCardLevel} from '../../__fixtures__/cards';
import {
  createAuthenticationState,
  createCatalogState,
  createPermissionsState,
  createNotificationsState,
  createStoreState,
  createDataState,
  createErrorsState,
  createSearchState,
  createSelectState,
  createNetworkState,
  createVideoState,
} from '../../__fixtures__/store';
import {StoreState} from '../store';
import {
  isExitNode,
  isCorrect,
  getNextContentRef,
  getPermissionStatus,
  getBestRank,
  getBestScore,
  getCard,
  getSection,
  getToken,
  getBrand,
  getBrandDefaultLanguage,
  getEngineVersions,
  isGodModeEnabled,
  isFastSlideEnabled,
  getNotificationsSettings,
  getCurrentScreenName,
  getCurrentTabName,
  getContext,
  getUser,
  isGodModeUser,
  getSections,
  getSectionsRef,
  getCards,
  getSearchRef,
  getHeroRef,
  getHero,
  isErrorVisible,
  isSearchFetching,
  getSearchValue,
  getErrorType,
  getFocusedSelect,
  isNetworkConnected,
  isVideoFullScreen,
  getYoutubeAPIKey,
  getLivesCount,
  isContentFinished,
  hasSuccessfullyFinished,
  getContentCorrectionInfo,
  getAppSession,
} from './state-extract';

const createDefaultLevel = (levelRef: string) => createLevel({ref: levelRef, chapterIds: ['666']});

const createDefaultProgression = (
  engine: Engine,
  levelRef: string,
  content: Content | void,
  nextContent: Content | void,
) =>
  createProgression({
    engine,
    progressionContent: {
      type: CONTENT_TYPE.LEVEL,
      ref: levelRef,
    },
    state: {
      content,
      nextContent,
    },
  });

const context = createContextWithPDF({title: 'Foo bar'});
const template = createTemplate({});
const slide = createSlide({
  ref: 'sli_foo',
  chapterId: 'cha_foo',
  question: template,
  context,
});

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R
  ? R
  : never;

const createState = ({
  engine = ENGINE.MICROLEARNING,
  levelRef = 'dummyRef',
  content,
  nextContent,
  slides = [],
  sections = [],
  cards = [],
  permissions,
  notifications,
  appSession = 1,
  token,
  brand,
  user,
  heroRef,
  errors,
  search,
  select,
}: {
  engine?: Engine;
  levelRef?: string;
  content?: Content | void;
  nextContent?: Content | void;
  slides?: Array<Slide>;
  sections?: Array<Section | void>;
  cards?: Array<DisciplineCard | ChapterCard>;
  permissions?: ReturnType<typeof createPermissionsState>;
  notifications?: ReturnType<typeof createNotificationsState>;
  token?: string | null;
  brand?: Brand | null;
  user?: User | null;
  heroRef?: string;
  appSession?: number;
  errors?: ReturnType<typeof createErrorsState>;
  search?: ReturnType<typeof createSearchState>;
  select?: ReturnType<typeof createSelectState>;
}): StoreState =>
  createStoreState({
    levels: [createDefaultLevel(levelRef)],
    disciplines: [],
    chapters: [],
    slides,
    progression: createDefaultProgression(engine, levelRef, content, nextContent),
    authentication: createAuthenticationState({
      user: user !== undefined ? user : createUser(),
      token: token !== undefined ? token : createToken({}),
      brand: brand !== undefined ? brand : createBrand({}),
    }),
    godMode: true,
    fastSlide: true,
    catalog: createCatalogState({sections, cards, heroRef}),
    permissions,
    notifications,
    appSession,
    errors,
    search,
    select,
  });

describe('State-extract', () => {
  describe('isExitNode', () => {
    it('should return false if nextContent is falsy', () => {
      const state: StoreState = createState({});
      delete state.data.progressions.entities.progression1.state.nextContent;
      const result = isExitNode(state);
      expect(result).toEqual(false);
    });

    it('should return true if nextContent is success', () => {
      const state: StoreState = createState({
        nextContent: {
          type: CONTENT_TYPE.SUCCESS,
          ref: SPECIFIC_CONTENT_REF.SUCCESS_EXIT_NODE,
        },
      });
      const result = isExitNode(state);
      expect(result).toEqual(true);
    });

    it('should return true if nextContent is failure', () => {
      const state: StoreState = createState({
        nextContent: {
          type: CONTENT_TYPE.FAILURE,
          ref: SPECIFIC_CONTENT_REF.FAILURE_EXIT_NODE,
        },
      });
      const result = isExitNode(state);
      expect(result).toEqual(true);
    });

    it('should return false if nextContent is a slide', () => {
      const state: StoreState = createState({
        type: CONTENT_TYPE.SLIDE,
        ref: '1234567',
      });
      const result = isExitNode(state);
      expect(result).toEqual(false);
    });

    it('should return false if nextContent is extraLife', () => {
      const state: StoreState = createState({
        nextContent: {
          type: CONTENT_TYPE.NODE,
          ref: SPECIFIC_CONTENT_REF.EXTRA_LIFE,
        },
      });
      const result = isExitNode(state);
      expect(result).toEqual(false);
    });
  });

  describe('hasSuccessfullyFinished', () => {
    it('should return false if nextContent is falsy', () => {
      const state: StoreState = createState({});
      delete state.data.progressions.entities.progression1.state.nextContent;
      const result = hasSuccessfullyFinished(state);
      expect(result).toEqual(false);
    });

    it('should return true if nextContent is success', () => {
      const state: StoreState = createState({
        nextContent: {
          type: CONTENT_TYPE.SUCCESS,
          ref: SPECIFIC_CONTENT_REF.SUCCESS_EXIT_NODE,
        },
      });
      const result = hasSuccessfullyFinished(state);
      expect(result).toEqual(true);
    });

    it('should return false if nextContent is failure', () => {
      const state: StoreState = createState({
        nextContent: {
          type: CONTENT_TYPE.FAILURE,
          ref: SPECIFIC_CONTENT_REF.FAILURE_EXIT_NODE,
        },
      });
      const result = hasSuccessfullyFinished(state);
      expect(result).toEqual(false);
    });

    it('should return false if nextContent is not exitNode', () => {
      const state: StoreState = createState({
        nextContent: {
          type: CONTENT_TYPE.NODE,
          ref: SPECIFIC_CONTENT_REF.EXTRA_LIFE,
        },
      });
      const result = hasSuccessfullyFinished(state);
      expect(result).toEqual(false);
    });
  });

  describe('isCorrect', () => {
    it('should return undefined if progression.state.isCorrect is null or not defined', () => {
      const state: StoreState = createState({});

      state.data.progressions.entities.progression1.state.isCorrect = null;
      expect(isCorrect(state)).toEqual(undefined);

      delete state.data.progressions.entities.progression1.state;
      expect(isCorrect(state)).toEqual(undefined);

      delete state.data.progressions.entities.progression1;
      expect(isCorrect(state)).toEqual(undefined);
    });

    it('should return progression.state.isCorrect if defined properly', () => {
      const state: StoreState = createState({});
      expect(isCorrect(state)).toEqual(true);
    });
  });

  describe('getNextContentRef', () => {
    it('should return next content ref', () => {
      const state: StoreState = createState({});

      const current = getNextContentRef(state);
      const expected = 'sli_foo';

      expect(current).toEqual(expected);
    });
  });

  describe('getPermissionStatus', () => {
    it('should return permission status', () => {
      const state: StoreState = createState({
        permissions: createPermissionsState({
          camera: PERMISSION_STATUS.DENIED,
        }),
      });

      const result = getPermissionStatus('camera')(state);
      const expected = PERMISSION_STATUS.DENIED;

      expect(result).toEqual(expected);
    });
  });

  describe('getBestScore', () => {
    it('should get the best score when bestScore is already existing', () => {
      const level = createLevel({ref: 'mod_10B', chapterIds: ['666']});
      const levelCard = createCardLevel({
        ref: 'mod_10B',
        status: 'isActive',
        label: 'Fake level',
        level: 'advanced',
      });
      const disciplineCard = createDisciplineCard({
        ref: 'dis1',
        completion: 0,
        levels: [levelCard],
        title: 'First discipline',
      });

      const progression = createProgression({
        engine: ENGINE.LEARNER,
        progressionContent: {
          type: CONTENT_TYPE.LEVEL,
          ref: 'mod_10B',
        },
      });

      const partialState = {
        cards: {
          entities: {
            dis1: {
              en: disciplineCard,
            },
          },
        },
        data: {
          contents: {
            level: {
              entities: {
                mod_10B: {...level, bestScore: 30},
              },
            },
          },
          progressions: {
            entities: {
              progression1: {
                ...progression,
                state: {...progression.state, stars: 40},
              },
            },
          },
          nextContent: {},
        },
        ui: {
          current: {
            progressionId: 'progression1',
          },
        },
      };
      const state: StoreState = createState({
        engine: ENGINE.LEARNER,
        levelRef: 'mod_10B',
      });

      const bestScore = getBestScore({...state, ...partialState});
      expect(bestScore).toEqual(10);
    });

    it('should get the best score when bestScore is not set so far', () => {
      const level = createLevel({ref: 'mod_10B', chapterIds: ['666']});
      const levelCard = createCardLevel({
        ref: 'mod_10B',
        status: 'isActive',
        label: 'Fake level',
        level: 'advanced',
      });
      const disciplineCard = createDisciplineCard({
        ref: 'dis1',
        completion: 0,
        levels: [levelCard],
        title: 'First discipline',
      });

      const progression = createProgression({
        engine: ENGINE.LEARNER,
        progressionContent: {
          type: CONTENT_TYPE.LEVEL,
          ref: 'mod_10B',
        },
      });

      const partialState = {
        cards: {
          entities: {
            dis1: {
              en: disciplineCard,
            },
          },
        },
        data: {
          contents: {
            level: {
              entities: {
                mod_10B: level,
              },
            },
          },
          progressions: {
            entities: {
              progression1: {
                ...progression,
                state: {...progression.state, stars: 40},
              },
            },
          },
          nextContent: {},
        },
        ui: {
          current: {
            progressionId: 'progression1',
          },
        },
      };
      const state: StoreState = createState({
        engine: ENGINE.LEARNER,
        levelRef: 'mod_10B',
      });

      const bestScore = getBestScore({...state, ...partialState});
      expect(bestScore).toEqual(40);
    });

    it('should show no updates if new stars not higher than bestScore', () => {
      const level = createLevel({ref: 'mod_10B', chapterIds: ['666']});
      const levelCard = createCardLevel({
        ref: 'mod_10B',
        status: 'isActive',
        label: 'Fake level',
        level: 'advanced',
      });
      const disciplineCard = createDisciplineCard({
        ref: 'dis1',
        completion: 0,
        levels: [levelCard],
        title: 'First discipline',
      });

      const progression = createProgression({
        engine: ENGINE.LEARNER,
        progressionContent: {
          type: CONTENT_TYPE.LEVEL,
          ref: 'mod_10B',
        },
      });

      const partialState = {
        cards: {
          entities: {
            dis1: {
              en: disciplineCard,
            },
          },
        },
        data: {
          contents: {
            level: {
              entities: {
                mod_10B: {...level, bestScore: 30},
              },
            },
          },
          progressions: {
            entities: {
              progression1: {
                ...progression,
                state: {...progression.state, stars: 10},
              },
            },
          },
          nextContent: {},
        },
        ui: {
          current: {
            progressionId: 'progression1',
          },
        },
      };
      const state: StoreState = createState({
        engine: ENGINE.LEARNER,
        levelRef: 'mod_10B',
      });

      const bestScore = getBestScore({...state, ...partialState});
      expect(bestScore).toEqual(0);
    });

    it('should return undefined if no stars are set', () => {
      const progression = createProgression({
        engine: ENGINE.LEARNER,
        progressionContent: {
          type: CONTENT_TYPE.LEVEL,
          ref: 'mod_10B',
        },
      });

      const partialState = {
        data: {
          progressions: {
            entities: {
              progression1: {...progression, state: {...progression.state}},
            },
          },
        },
        ui: {
          current: {
            progressionId: 'progression1',
          },
        },
      };
      const state: StoreState = createState({
        engine: ENGINE.LEARNER,
        levelRef: 'mod_10B',
      });

      const bestScore = getBestScore({...state, ...partialState});
      expect(bestScore).toEqual(undefined);
    });
  });

  describe('getBestRank', () => {
    it('should get the best rank if start and end are different', () => {
      const state = {
        data: {
          rank: {
            start: 20,
            end: 30,
          },
        },
      };

      // @ts-ignore
      const bestScore = getBestRank(state);
      expect(bestScore).toEqual('-10');
    });
    it('should return null if start and end are equal', () => {
      const state = {
        data: {
          rank: {
            start: 20,
            end: 20,
          },
        },
      };

      // @ts-ignore
      const bestScore = getBestRank(state);
      expect(bestScore).toEqual(null);
    });
    it('should return +score if end < start', () => {
      const state = {
        data: {
          rank: {
            start: 20,
            end: 10,
          },
        },
      };

      // @ts-ignore
      const bestScore = getBestRank(state);
      expect(bestScore).toEqual('+10');
    });
  });

  describe('getCard', () => {
    it('should get card', () => {
      const card = createChapterCard({
        ref: 'cha1',
        completion: 0,
        status: CARD_STATUS.ACTIVE,
        title: 'First chapter',
      });
      const state = createState({
        cards: [card],
      });
      // @ts-ignore
      const result = getCard(state, 'cha1');
      expect(result).toEqual(card);
    });
  });

  describe('getSection', () => {
    it('should get section', () => {
      const state = {
        authentication: {
          language: 'en',
        },
        catalog: {
          entities: {
            sections: {
              foo: {
                en: 'section',
              },
            },
          },
        },
      };
      // @ts-ignore
      const result = getSection(state, 'foo', 'en');
      expect(result).toEqual('section');
    });

    it('should get section with default lang', () => {
      const state = {
        authentication: {
          language: 'en',
        },
        catalog: {
          entities: {
            sections: {
              foo: {
                en: 'section',
              },
            },
          },
        },
      };
      // @ts-ignore
      const result = getSection(state, 'foo');
      expect(result).toEqual('section');
    });
  });

  describe('getToken', () => {
    it('should get token', () => {
      const token = createToken({});
      const state = createState({
        token,
      });
      // @ts-ignore
      const result = getToken(state);
      expect(result).toEqual(token);
    });
  });

  describe('getBrand', () => {
    it('should get brand', () => {
      const brand = createBrand({});
      const state = createState({
        brand,
      });

      const result = getBrand(state);
      const expected = brand;

      expect(result).toEqual(expected);
    });
  });

  describe('getBrand', () => {
    it('should get brand default language', () => {
      const defaultLanguage = 'de';
      const brand = createBrand({defaultLanguage});
      const state = createState({
        brand,
      });

      const result = getBrandDefaultLanguage(state);
      const expected = defaultLanguage;

      expect(result).toEqual(expected);
    });

    it('should not get brand default language', () => {
      const state = createState({
        brand: null,
      });

      const result = getBrandDefaultLanguage(state);

      expect(result).toBeUndefined();
    });
  });

  describe('getEngineVersions', () => {
    it('should get engine versions if brand is defined', () => {
      const state = createState({});

      const result = getEngineVersions(state);
      const expected: ProgressionEngineVersions = {
        versions: {
          [ENGINE.LEARNER]: '2',
          [ENGINE.MICROLEARNING]: '2',
        },
      };

      expect(result).toEqual(expected);
    });

    it('should get undefined if brand is not defined', () => {
      const state = createState({});

      delete state.authentication.brand;

      const result = getEngineVersions(state);
      const expected = undefined;

      expect(result).toEqual(expected);
    });
  });

  describe('getYoutubeAPIKey', () => {
    it('should return undefined if brand is undefined', () => {
      const state = createState({});
      delete state.authentication.brand;

      const result = getYoutubeAPIKey(state);
      expect(result).toEqual(undefined);
    });
    it('should get the youtube apiKey if brand is defined', () => {
      const state = createState({});

      const result = getYoutubeAPIKey(state);

      expect(result).toEqual('7Hi5iS4f4k34P1K3Y');
    });
  });

  describe('isGodModeEnabled', () => {
    it('should get value from state', () => {
      const state = createState({});

      const result = isGodModeEnabled(state);

      expect(result).toBeTruthy();
    });
  });

  describe('isFastSlideEnabled', () => {
    it('should get value from state', () => {
      const state = createState({});

      const result = isFastSlideEnabled(state);

      expect(result).toBeTruthy();
    });
  });

  describe('getNotificationsSettings', () => {
    it('should all notifications settings from state', () => {
      const notifications = {
        settings: {
          'finish-course': {
            label: 'reminder',
            isActive: false,
          },
          suggestion: {
            label: 'reminder',
            isActive: false,
          },
        },
      };

      const state = createState({
        notifications,
      });

      const result = getNotificationsSettings(state);

      expect(result).toEqual(notifications.settings);
    });
  });

  describe('getAppSession', () => {
    it('should get value from state', () => {
      const state = createState({});

      const result = getAppSession(state);

      expect(result).toEqual(1);
    });
  });

  describe('getCurrentScreenName', () => {
    it('should get current screen name', () => {
      const state = createState({});

      const result = getCurrentScreenName(state);
      const expected = 'dummyScreenName';

      expect(result).toEqual(expected);
    });
  });

  describe('getCurrentTabName', () => {
    it('should get current tab name', () => {
      const state = createState({});

      const result = getCurrentTabName(state);
      const expected = 'dummyTabName';

      expect(result).toEqual(expected);
    });
  });

  describe('getContext', () => {
    it('should get context', () => {
      const state = createState({
        slides: [slide],
      });

      const result = getContext(state);
      const expected = context;

      expect(result).toEqual(expected);
    });
  });

  describe('getUser', () => {
    it('should return the user', () => {
      const user = createUser();
      const state = createState({
        user,
      });

      const result = getUser(state);
      const expected = user;

      expect(result).toEqual(expected);
    });
  });

  describe('isGodModeUser', () => {
    it('should return true', () => {
      const brand = createBrand({});
      const token = createToken({
        brand: brand.name,
        roles: [ROLES.USER, ROLES.GODMODE],
      });
      const state = createState({
        token,
        brand,
      });

      const result = isGodModeUser(state);

      expect(result).toBeTruthy();
    });

    it('should return false', () => {
      const token = createToken({});
      const brand = createBrand({});
      const state = createState({
        token,
        brand,
      });

      const result = isGodModeUser(state);

      expect(result).toBeFalsy();
    });

    it('should return false if no token or brand are defined', () => {
      const state = createState({
        token: null,
        brand: null,
      });

      const result = isGodModeUser(state);

      expect(result).toBeFalsy();
    });
  });

  describe('getSections', () => {
    it('should get sections', () => {
      const sections = createSections();
      const state = createState({
        sections: sections.concat([undefined]),
      });

      const result = getSections(state);
      const expected = sections.reduce(
        (_result, section) => ({
          ..._result,
          [section.key]: {
            en: section,
          },
        }),
        {},
      );

      expect(result).toEqual(expected);
    });
  });

  describe('getSectionsRef', () => {
    it('should get sections ref', () => {
      const state = createState({
        sections: createSections().concat([undefined]),
      });

      const result = getSectionsRef(state);
      const expected = ['recommended', 'most-popular', undefined];

      expect(result).toEqual(expected);
    });

    it('should get empty array', () => {
      const state = createState({});

      const result = getSectionsRef(state);
      const expected = [];

      expect(result).toEqual(expected);
    });
  });

  describe('getCards', () => {
    it('should get cards', () => {
      const levelCard = createCardLevel({
        ref: 'mod_10B',
        status: 'isActive',
        label: 'Fake level',
        level: 'advanced',
      });
      const disciplineCard = createDisciplineCard({
        ref: 'dis1',
        completion: 0,
        levels: [levelCard],
        title: 'First discipline',
      });
      const chapterCard = createChapterCard({
        ref: 'cha1',
        completion: 0,
        status: CARD_STATUS.ACTIVE,
        title: 'First chapter',
      });
      const state = createState({
        cards: [disciplineCard, chapterCard],
      });

      const result = getCards(state);
      const expected = {
        [chapterCard.universalRef]: {
          en: chapterCard,
        },
        [disciplineCard.universalRef]: {
          en: disciplineCard,
        },
      };

      expect(result).toEqual(expected);
    });
  });

  describe('getSearchRef', () => {
    it('should get search ref', () => {
      const levelCard = createCardLevel({
        ref: 'mod_10B',
        status: 'isActive',
        label: 'Fake level',
        level: 'advanced',
      });
      const disciplineCard = createDisciplineCard({
        ref: 'dis1',
        completion: 0,
        levels: [levelCard],
        title: 'First discipline',
      });
      const chapterCard = createChapterCard({
        ref: 'cha1',
        completion: 0,
        status: CARD_STATUS.ACTIVE,
        title: 'First chapter',
      });
      const state = createState({
        cards: [disciplineCard, chapterCard].concat([undefined]),
      });

      const result = getSearchRef(state);
      const expected = ['dis1', 'cha1', undefined];

      expect(result).toEqual(expected);
    });

    it('should get undefined', () => {
      const state = createState({});

      const result = getSearchRef(state);

      expect(result).toBeUndefined;
    });
  });

  describe('getHeroRef', () => {
    it('should get ref', () => {
      const heroRef = 'foo';
      const state = createState({
        heroRef,
      });

      const result = getHeroRef(state);
      const expected = heroRef;

      expect(result).toEqual(expected);
    });
  });

  describe('getHero', () => {
    it('should get hero', () => {
      const card = createChapterCard({
        ref: 'cha1',
        completion: 0,
        status: CARD_STATUS.ACTIVE,
        title: 'First chapter',
      });
      const state = createState({
        cards: [card],
        heroRef: 'cha1',
      });

      const result = getHero(state);
      const expected = card;

      expect(result).toEqual(expected);
    });

    it('should return undefined', () => {
      const state = createState({
        cards: [],
        heroRef: 'cha1',
      });

      const result = getHero(state);

      expect(result).toBeUndefined;
    });
  });

  describe('isErrorVisible', () => {
    it('should return false', () => {
      const state = createState({});

      const result = isErrorVisible(state);

      expect(result).toBeFalsy;
    });

    it('should return true', () => {
      const state = createState({
        errors: createErrorsState({isVisible: true}),
      });

      const result = isErrorVisible(state);

      expect(result).toBeTruthy;
    });
  });

  describe('isSearchFetching', () => {
    it('should return false', () => {
      const state = createState({});

      const result = isSearchFetching(state);

      expect(result).toBeFalsy;
    });

    it('should return true', () => {
      const state = createState({
        search: createSearchState({isFetching: true}),
      });

      const result = isSearchFetching(state);

      expect(result).toBeTruthy;
    });
  });

  describe('getSearchValue', () => {
    it('should return undefined', () => {
      const state = createState({});

      const result = getSearchValue(state);

      expect(result).toBeUndefined;
    });

    it('should return the value', () => {
      const value = 'foo';
      const state = createState({
        search: createSearchState({value}),
      });

      const result = getSearchValue(state);
      const expected = value;

      expect(result).toEqual(expected);
    });
  });

  describe('getErrorType', () => {
    it('should return undefined', () => {
      const state = createState({});

      const result = getErrorType(state);

      expect(result).toBeUndefined;
    });

    it('should return the error type', () => {
      const type = ERROR_TYPE.PLATFORM_NOT_ACTIVATED;
      const state = createState({
        errors: createErrorsState({type}),
      });

      const result = getErrorType(state);
      const expected = type;

      expect(result).toEqual(expected);
    });
  });

  describe('getFocusedSelect', () => {
    it('should return undefined', () => {
      const state = createState({});
      const result = getFocusedSelect(state);

      expect(result).toBeUndefined;
    });

    it('should return the selected id', () => {
      const id = 'foo';
      const state = createState({
        select: createSelectState({id}),
      });

      const result = getFocusedSelect(state);
      const expected = id;

      expect(result).toEqual(expected);
    });
  });

  describe('isNetworkConnected', () => {
    it('should return false', () => {
      const state = createState({});
      const result = isNetworkConnected(state);

      expect(result).toBeFalsy;
    });

    it('should return true', () => {
      const state = createState({
        network: createNetworkState({isConnected: true}),
      });

      const result = isNetworkConnected(state);

      expect(result).toBeTruthy;
    });
  });

  describe('isVideoFullScreen', () => {
    it('should return false', () => {
      const state = createState({});
      const result = isVideoFullScreen(state);

      expect(result).toBeFalsy;
    });

    it('should return true', () => {
      const state = createState({
        video: createVideoState({isFullScreen: true}),
      });

      const result = isVideoFullScreen(state);

      expect(result).toBeTruthy;
    });
  });

  describe('getLivesCount', () => {
    it('should return the default number of lives', () => {
      const fakeState = createProgressionState({
        stars: 22,
        step: {
          current: 20,
        },
      });

      const chapter = createChapter({
        ref: 'cha_foo',
        name: 'chapter',
      });

      const progression = createProgression({
        engine: ENGINE.LEARNER,
        progressionContent: {
          type: CONTENT_TYPE.LEVEL,
          ref: 'level_foo',
        },
        state: fakeState,
      });

      const state: StoreState = createStoreState({
        progression,
        data: createDataState({
          chapters: [chapter],
          slides: [slide],
          progression,
        }),
      });

      const lives = getLivesCount(state);
      expect(lives).toEqual(4);
    });

    it('should return undefined if current chapter is adaptive', () => {
      const fakeState = createProgressionState({
        stars: 22,
        step: {
          current: 20,
        },
      });

      const chapter = createChapter({
        ref: 'cha_foo',
        name: 'chapter',
        isConditional: true,
      });

      const progression = createProgression({
        engine: ENGINE.MICROLEARNING,
        progressionContent: {
          type: CONTENT_TYPE.SLIDE,
          ref: 'sli_foo',
        },
        state: fakeState,
      });

      const state: StoreState = createStoreState({
        progression,
        data: createDataState({
          chapters: [chapter],
          slides: [slide],
          progression,
        }),
      });

      const lives = getLivesCount(state);
      expect(lives).toEqual(undefined);
    });
  });

  describe('isContentFinished', () => {
    it('should return true if nextContent is an exit node', () => {
      const progression = createProgression({
        engine: ENGINE.MICROLEARNING,
        progressionContent: {
          type: CONTENT_TYPE.SLIDE,
          ref: 'sli_foo',
        },
        state: {
          nextContent: {
            ref: SPECIFIC_CONTENT_REF.SUCCESS_EXIT_NODE,
            type: CONTENT_TYPE.SUCCESS,
          },
          step: {
            current: 4,
          },
        },
      });

      const state: StoreState = createStoreState({
        progression,
      });
      const isFinished = isContentFinished(state);
      expect(isFinished).toEqual(true);
    });
    it('should return true if nextContent is an exit node', () => {
      const progression = createProgression({
        engine: ENGINE.LEARNER,
        progressionContent: {
          type: CONTENT_TYPE.LEVEL,
          ref: 'level_foo',
        },
        state: createProgressionState({
          nextContent: {
            type: CONTENT_TYPE.NODE,
            ref: SPECIFIC_CONTENT_REF.EXTRA_LIFE,
          },
          lives: 0,
        }),
      });

      const state: StoreState = createStoreState({
        progression,
      });
      const isFinished = isContentFinished(state);
      expect(isFinished).toEqual(true);
    });
  });

  describe('getContentCorrectionInfo', () => {
    beforeEach(() => {
      jest.resetModules();
    });

    const _template = createTemplate({});
    const _slide = createSlide({
      ref: 'sli_foo',
      chapterId: 'cha_foo',
      question: _template,
    });

    describe('getContentCorrectionInfo', () => {
      it('should navigate to correction screen if content is not finished and is not an adaptive and progression isCorrect is a boolean', () => {
        const progression = createProgression({
          engine: ENGINE.MICROLEARNING,
          progressionContent: {
            type: CONTENT_TYPE.SLIDE,
            ref: 'sli_foo',
          },
          state: {
            isCorrect: true,
            step: {
              current: 4,
            },
          },
        });

        const chapter = createChapter({
          ref: 'cha_foo',
          name: 'chapter',
        });

        const state: StoreState = createStoreState({
          progression,
          data: createDataState({
            chapters: [chapter],
            slides: [_slide],
            progression,
          }),
        });

        const result = getContentCorrectionInfo(state);

        expect(result).toEqual({
          hasContext: false,
          isAdaptive: false,
          isContentFinished: false,
          isCorrect: false,
          progressionId: 'progression1',
        });
      });

      it('should navigate to question screen if content is not finished and is an adaptive', () => {
        const progression = createProgression({
          engine: ENGINE.MICROLEARNING,
          progressionContent: {
            type: CONTENT_TYPE.SLIDE,
            ref: 'sli_foo',
          },
          state: {
            isCorrect: null,
            step: {
              current: 4,
            },
          },
        });

        const chapter = createChapter({
          ref: 'cha_foo',
          name: 'chapter',
          isConditional: true,
        });

        const state: StoreState = createStoreState({
          progression,
          data: createDataState({
            chapters: [chapter],
            slides: [_slide],
            progression,
          }),
        });

        const result = getContentCorrectionInfo(state);

        expect(result).toEqual({
          hasContext: false,
          isAdaptive: true,
          isContentFinished: false,
          isCorrect: false,
          progressionId: 'progression1',
        });
      });

      it('should navigate to context screen if content is not finished and is an adaptive with context', () => {
        const progression = createProgression({
          engine: ENGINE.MICROLEARNING,
          progressionContent: {
            type: CONTENT_TYPE.SLIDE,
            ref: 'sli_foo',
          },
          state: {
            isCorrect: null,
            step: {
              current: 4,
            },
          },
        });

        const chapter = createChapter({
          ref: 'cha_foo',
          name: 'chapter',
          isConditional: true,
        });

        _slide.context = createContextWithImage({title: 'Juste a context'});

        const state: StoreState = createStoreState({
          progression,
          data: createDataState({
            chapters: [chapter],
            slides: [_slide],
            progression,
          }),
        });

        const result = getContentCorrectionInfo(state);

        expect(result).toEqual({
          hasContext: true,
          isAdaptive: true,
          isContentFinished: false,
          isCorrect: false,
          progressionId: 'progression1',
        });
      });

      it('should navigate to level-end screen if content is finished in success and is not an adaptive', () => {
        const progression = createProgression({
          engine: ENGINE.MICROLEARNING,
          progressionContent: {
            type: CONTENT_TYPE.SLIDE,
            ref: 'sli_foo',
          },
          state: {
            isCorrect: true,
            nextContent: {
              ref: SPECIFIC_CONTENT_REF.SUCCESS_EXIT_NODE,
              type: CONTENT_TYPE.SUCCESS,
            },
            step: {
              current: 4,
            },
            lives: 4,
          },
        });

        const chapter = createChapter({
          ref: 'cha_foo',
          name: 'chapter',
        });

        const state: StoreState = createStoreState({
          progression,
          data: createDataState({
            chapters: [chapter],
            slides: [_slide],
            progression,
          }),
        });

        const result = getContentCorrectionInfo(state);

        expect(result).toEqual({
          hasContext: false,
          isAdaptive: false,
          isContentFinished: true,
          isCorrect: true,
          progressionId: 'progression1',
        });
      });
      it('should navigate to level-end screen if content is finished in failure and is not an adaptive', () => {
        const progression = createProgression({
          engine: ENGINE.MICROLEARNING,
          progressionContent: {
            type: CONTENT_TYPE.SLIDE,
            ref: 'sli_foo',
          },
          state: {
            isCorrect: true,
            nextContent: {
              ref: SPECIFIC_CONTENT_REF.SUCCESS_EXIT_NODE,
              type: CONTENT_TYPE.SUCCESS,
            },
            step: {
              current: 4,
            },
            lives: 0,
          },
        });

        const chapter = createChapter({
          ref: 'cha_foo',
          name: 'chapter',
        });

        const state: StoreState = createStoreState({
          progression,
          data: createDataState({
            chapters: [chapter],
            slides: [_slide],
            progression,
          }),
        });

        const result = getContentCorrectionInfo(state);

        expect(result).toEqual({
          hasContext: false,
          isAdaptive: false,
          isContentFinished: true,
          isCorrect: false,
          progressionId: 'progression1',
        });
      });
      it('should navigate to level-end screen if content is finished', () => {
        const progression = createProgression({
          engine: ENGINE.MICROLEARNING,
          progressionContent: {
            type: CONTENT_TYPE.SLIDE,
            ref: 'sli_foo',
          },
          state: {
            isCorrect: null,
            nextContent: {
              ref: SPECIFIC_CONTENT_REF.SUCCESS_EXIT_NODE,
              type: CONTENT_TYPE.SUCCESS,
            },
            step: {
              current: 4,
            },
          },
        });

        const chapter = createChapter({
          ref: 'cha_foo',
          name: 'chapter',
          isConditional: true,
        });

        const state: StoreState = createStoreState({
          progression,
          data: createDataState({
            chapters: [chapter],
            slides: [_slide],
            progression,
          }),
        });

        const result = getContentCorrectionInfo(state);

        expect(result).toEqual({
          hasContext: false,
          isAdaptive: true,
          isContentFinished: true,
          isCorrect: true,
          progressionId: 'progression1',
        });
      });
    });
  });
});
