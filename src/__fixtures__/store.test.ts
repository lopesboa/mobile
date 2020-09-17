import type {QCMQuestion, Lesson} from '../types/coorpacademy/progression-engine';

import type {StoreState} from '../redux/store';
import {PERMISSION_STATUS, NOTIFICATION_SETTINGS_STATUS} from '../const';
import {createBrand} from './brands';
import {createMapObject, createStoreState, createAuthenticationState} from './store';
import {createLevel} from './levels';
import {createSlide} from './slides';
import {createQCM} from './questions';
import {createProgression} from './progression';
import {createUser} from './user';

describe('storeFixture', () => {
  it('should override progressionEngine', () => {
    const authState = createAuthenticationState({
      brand: createBrand({
        progressionEngine: {
          versions: {
            learner: '1',
            microlearning: 'latest',
          },
        },
      }),
    });
    const versions =
      authState &&
      authState.brand &&
      authState.brand.progressionEngine &&
      authState.brand.progressionEngine.versions;
    expect(versions).toEqual({
      learner: '1',
      microlearning: 'latest',
    });
  });

  it('should reduce an array  of Mappable Objects to an object -- with ref', () => {
    const dummyObject1 = {ref: 'dummyId'};
    const dummyObject2 = {ref: 'dummyId2'};

    const mappableObject = [dummyObject1, dummyObject2];

    const expectedResult = {
      [dummyObject1.ref]: dummyObject1,
      [dummyObject2.ref]: dummyObject2,
    };

    const result = createMapObject(mappableObject);

    expect(result).toEqual(expectedResult);
  });

  it('should reduce an array  of Mappable Objects to an object -- with universalRef', () => {
    const dummyObject1 = {universalRef: 'dummyId'};
    const dummyObject2 = {universalRef: 'dummyId2'};

    const mappableObject = [dummyObject1, dummyObject2];

    const expectedResult = {
      [dummyObject1.universalRef]: dummyObject1,
      [dummyObject2.universalRef]: dummyObject2,
    };

    const result = createMapObject(mappableObject);

    expect(result).toEqual(expectedResult);
  });

  it('should reduce an array  of Mappable Objects to an object -- with _id', () => {
    const dummyObject1 = {_id: 'dummyId'};
    const dummyObject2 = {_id: 'dummyId2'};

    const mappableObject = [dummyObject1, dummyObject2];

    const expectedResult = {
      [dummyObject1._id]: dummyObject1,
      [dummyObject2._id]: dummyObject2,
    };

    const result = createMapObject(mappableObject);

    expect(result).toEqual(expectedResult);
  });

  it('should return a mocked store', () => {
    const level1 = createLevel({ref: 'dummyRef', chapterIds: ['cha1,cha2']});

    const mappedLevel = {
      [level1.ref]: {
        _id: level1._id,
        universalRef: level1.universalRef,
        ref: level1.ref,
        name: level1.name,
        level: level1.level,
        meta: level1.meta,
        poster: level1.poster,
        chapterIds: level1.chapterIds,
        levelTranslation: level1.levelTranslation,
        mediaUrl: level1.mediaUrl,
        timeAlloted: level1.timeAlloted,
        eligibleBattle: level1.eligibleBattle,
        creditsToAccess: level1.creditsToAccess,
        infiniteLives: level1.infiniteLives,
        isConditional: level1.isConditional,
        acquiredSkills: level1.acquiredSkills,
        data: level1.data,
        stats: level1.stats,
        version: level1.version,
        external_refs: level1.external_refs,
      },
    };

    const media = {
      mediaUrl: 'fakeMediaUrl',
    };

    const question: QCMQuestion = createQCM({media});
    const lessons: Lesson[] = [];

    const slide1 = {
      ...createSlide({
        ref: 'ref',
        // @ts-ignore union type  :(
        question,
        chapterId: 'lol',
      }),
      lessons,
    };

    const mappedSlide = {
      [slide1._id]: {
        _id: slide1._id,
        chapter_id: slide1.chapter_id,
        klf: slide1.klf,
        authors: slide1.authors,
        lessons,
        meta: slide1.meta,
        tips: slide1.tips,
        clue: slide1.clue,
        context: slide1.context,
        question: slide1.question,
        position: slide1.position,
      },
    };

    const catalogState = {
      heroRef: undefined,
      searchRef: undefined,
      sectionsRef: undefined,
      entities: {
        cards: {},
        sections: {},
      },
    };

    const authenticationState = {
      token: '__TOKEN__',
      user: createUser(),
      brand: {
        colors: {
          primary: '#00B0FF',
        },
        contentCategoryName: 'Mobile',
        hero:
          'https://static.coorpacademy.com/content/mobile/raw/coorp_logo_infinite-1552063832916.png',
        host: 'https://mobile-staging.coorpacademy.com',
        images: {
          'logo-mobile':
            'https://static.coorpacademy.com/content/mobile/raw/coorp_logo_infinite-1552063832916.png',
        },
        name: 'mobile',
        youtube: {
          apiKey: '7Hi5iS4f4k34P1K3Y',
        },
        progressionEngine: {
          versions: {
            learner: '2',
            microlearning: '2',
          },
        },
        supportedLanguages: ['fr', 'de', 'it', 'zh'],
        defaultLanguage: 'en',
        env: 'staging',
      },
    };

    const permissionsState = {
      camera: PERMISSION_STATUS.UNDETERMINED,
      notifications: PERMISSION_STATUS.UNDETERMINED,
    };

    const progressionsState = {
      isSynchronizing: false,
    };

    const videoState = {
      isFullScreen: false,
    };

    const networkState = {
      isConnected: true,
      actionQueue: [],
      isQueuePaused: false,
    };

    const progression = createProgression({
      engine: 'microlearning',
      progressionContent: {
        type: 'level',
        ref: level1.ref,
      },
    });

    const data = {
      answers: {
        entities: {},
      },
      comments: {
        entities: {},
      },
      configs: {
        entities: {},
      },
      contents: {
        level: {
          entities: mappedLevel,
        },
        slide: {
          entities: mappedSlide,
        },
        chapter: {
          entities: {},
        },
        discipline: {
          entities: {},
        },
      },
      videos: {
        entities: {},
      },
      clues: {
        entities: {},
      },
      exitNodes: {
        entities: {},
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
          progression1: undefined,
        },
      },
    };

    const expectedResult: StoreState = {
      data: data,
      errors: {
        isVisible: false,
        type: undefined,
      },
      select: null,
      isValidating: false,
      search: {
        isFetching: false,
        value: undefined,
      },
      ui: {
        answers: {},
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
      },
      navigation: {
        currentNavigatorName: 'dummyNavigatorName',
        currentAppScreenName: 'dummycurrentAppScreenName',
        currentScreenName: 'dummyScreenName',
        currentTabName: 'dummyTabName',
      },
      catalog: catalogState,
      permissions: permissionsState,
      notifications: {
        settings: {
          'finish-course': {
            label: 'Weekly Reminder',
            status: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
          },
          suggestion: {
            label: 'You might like it',
            status: NOTIFICATION_SETTINGS_STATUS.ACTIVATED,
          },
        },
      },
      authentication: authenticationState,
      progressions: progressionsState,
      godMode: false,
      fastSlide: false,
      appSession: 0,
      video: videoState,
      network: networkState,
    };

    const result = createStoreState({
      levels: [level1],
      slides: [slide1],
      chapters: [],
      disciplines: [],
      progression,
    });
    expect(result).toEqual(expectedResult);
  });
});
