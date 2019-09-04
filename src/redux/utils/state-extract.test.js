// @flow strict

import type {Content} from '@coorpacademy/progression-engine';

import type {Slide} from '../../layer/data/_types';
import type {Engine, ProgressionEngineVersions} from '../../types';
import {ENGINE, CONTENT_TYPE, SPECIFIC_CONTENT_REF, PERMISSION_STATUS} from '../../const';
import {createBrand} from '../../__fixtures__/brands';
import {createLevel} from '../../__fixtures__/levels';
import {createProgression} from '../../__fixtures__/progression';
import {createSlide} from '../../__fixtures__/slides';
import {createTemplate} from '../../__fixtures__/questions';
import {createContextWithPDF} from '../../__fixtures__/context';
import {createDisciplineCard, createCardLevel} from '../../__fixtures__/cards';
import {createAuthenticationState, createStoreState} from '../../__fixtures__/store';
import {
  isExitNode,
  isCorrect,
  getCurrentStep,
  getNextContentRef,
  hasPermission,
  getBestRank,
  getBestScore,
  getCard,
  getSection,
  getToken,
  getBrand,
  getEngineVersions,
  isGodModeEnabled,
  isFastSlideEnabled,
  getCurrentScreenName,
  getCurrentTabName,
  getContext
} from './state-extract';

const createDefaultLevel = (levelRef: string) => createLevel({ref: levelRef, chapterIds: ['666']});

const createDefaultProgression = (
  engine: Engine,
  levelRef: string,
  content: Content | void,
  nextContent: Content | void
) =>
  createProgression({
    engine,
    progressionContent: {
      type: CONTENT_TYPE.LEVEL,
      ref: levelRef
    },
    state: {
      content,
      nextContent
    }
  });

const brand = createBrand({});
const authentication = createAuthenticationState({brand});

const context = createContextWithPDF({title: 'Foo bar'});
const template = createTemplate({});
const slide = createSlide({
  ref: 'sli_foo',
  chapterId: 'cha_foo',
  question: template,
  context
});

const createState = ({
  engine = ENGINE.MICROLEARNING,
  levelRef = 'dummyRef',
  content,
  nextContent,
  slides = []
}: {
  engine?: Engine,
  levelRef?: string,
  content?: Content | void,
  nextContent?: Content | void,
  slides?: Array<Slide>
}): StoreState => {
  const level = createDefaultLevel(levelRef);
  const state: StoreState = createStoreState({
    levels: [level],
    disciplines: [],
    chapters: [],
    slides,
    progression: createDefaultProgression(engine, levelRef, content, nextContent),
    authentication,
    godMode: true,
    fastSlide: true
  });
  return state;
};

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
          ref: SPECIFIC_CONTENT_REF.SUCCESS_EXIT_NODE
        }
      });
      const result = isExitNode(state);
      expect(result).toEqual(true);
    });

    it('should return true if nextContent is failure', () => {
      const state: StoreState = createState({
        nextContent: {
          type: CONTENT_TYPE.FAILURE,
          ref: SPECIFIC_CONTENT_REF.FAILURE_EXIT_NODE
        }
      });
      const result = isExitNode(state);
      expect(result).toEqual(true);
    });

    it('should return false if nextContent is a slide', () => {
      const state: StoreState = createState({
        type: CONTENT_TYPE.SLIDE,
        ref: '1234567'
      });
      const result = isExitNode(state);
      expect(result).toEqual(false);
    });

    it('should return false if nextContent is extraLife', () => {
      const state: StoreState = createState({
        nextContent: {
          type: CONTENT_TYPE.NODE,
          ref: SPECIFIC_CONTENT_REF.EXTRA_LIFE
        }
      });
      const result = isExitNode(state);
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

  describe('getCurrentStep', () => {
    it('should return current step', () => {
      const state: StoreState = createState({});

      const current = getCurrentStep(state);
      const expected = 1;

      expect(current).toEqual(expected);
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

  describe('hasPermission', () => {
    it('should return true', () => {
      const result = hasPermission({camera: PERMISSION_STATUS.AUTHORIZED}, 'camera');
      expect(result).toBeTruthy();
    });

    it('should return false', () => {
      const result = hasPermission({}, 'camera');
      expect(result).toBeFalsy();
    });
  });

  describe('getBestScore', () => {
    it('should get the best score when bestScore is already existing', () => {
      const level = createLevel({ref: 'mod_10B', chapterIds: ['666']});
      const levelCard = createCardLevel({
        ref: 'mod_10B',
        status: 'isActive',
        label: 'Fake level',
        level: 'advanced'
      });
      const disciplineCard = createDisciplineCard({
        ref: 'dis1',
        completion: 0,
        levels: [levelCard],
        title: 'First discipline'
      });

      const progression = createProgression({
        engine: ENGINE.LEARNER,
        progressionContent: {
          type: CONTENT_TYPE.LEVEL,
          ref: 'mod_10B'
        }
      });

      const partialState = {
        cards: {
          entities: {
            dis1: {
              en: disciplineCard
            }
          }
        },
        data: {
          contents: {
            level: {
              entities: {
                mod_10B: {...level, bestScore: 30}
              }
            }
          },
          progressions: {
            entities: {
              progression1: {...progression, state: {...progression.state, stars: 40}}
            }
          },
          nextContent: {}
        },
        ui: {
          current: {
            progressionId: 'progression1'
          }
        }
      };
      const state: StoreState = createState({
        engine: ENGINE.LEARNER,
        levelRef: 'mod_10B'
      });

      const bestScore = getBestScore({...state, ...partialState});
      expect(bestScore).toEqual('10');
    });

    it('should get the best score when bestScore is not set so far', () => {
      const level = createLevel({ref: 'mod_10B', chapterIds: ['666']});
      const levelCard = createCardLevel({
        ref: 'mod_10B',
        status: 'isActive',
        label: 'Fake level',
        level: 'advanced'
      });
      const disciplineCard = createDisciplineCard({
        ref: 'dis1',
        completion: 0,
        levels: [levelCard],
        title: 'First discipline'
      });

      const progression = createProgression({
        engine: ENGINE.LEARNER,
        progressionContent: {
          type: CONTENT_TYPE.LEVEL,
          ref: 'mod_10B'
        }
      });

      const partialState = {
        cards: {
          entities: {
            dis1: {
              en: disciplineCard
            }
          }
        },
        data: {
          contents: {
            level: {
              entities: {
                mod_10B: level
              }
            }
          },
          progressions: {
            entities: {
              progression1: {...progression, state: {...progression.state, stars: 40}}
            }
          },
          nextContent: {}
        },
        ui: {
          current: {
            progressionId: 'progression1'
          }
        }
      };
      const state: StoreState = createState({
        engine: ENGINE.LEARNER,
        levelRef: 'mod_10B'
      });

      const bestScore = getBestScore({...state, ...partialState});
      expect(bestScore).toEqual('40');
    });

    it('should show no updates if new stars not higher than bestScore', () => {
      const level = createLevel({ref: 'mod_10B', chapterIds: ['666']});
      const levelCard = createCardLevel({
        ref: 'mod_10B',
        status: 'isActive',
        label: 'Fake level',
        level: 'advanced'
      });
      const disciplineCard = createDisciplineCard({
        ref: 'dis1',
        completion: 0,
        levels: [levelCard],
        title: 'First discipline'
      });

      const progression = createProgression({
        engine: ENGINE.LEARNER,
        progressionContent: {
          type: CONTENT_TYPE.LEVEL,
          ref: 'mod_10B'
        }
      });

      const partialState = {
        cards: {
          entities: {
            dis1: {
              en: disciplineCard
            }
          }
        },
        data: {
          contents: {
            level: {
              entities: {
                mod_10B: {...level, bestScore: 30}
              }
            }
          },
          progressions: {
            entities: {
              progression1: {...progression, state: {...progression.state, stars: 10}}
            }
          },
          nextContent: {}
        },
        ui: {
          current: {
            progressionId: 'progression1'
          }
        }
      };
      const state: StoreState = createState({
        engine: ENGINE.LEARNER,
        levelRef: 'mod_10B'
      });

      const bestScore = getBestScore({...state, ...partialState});
      expect(bestScore).toEqual('0');
    });

    it('should return undefined if no stars are set', () => {
      const progression = createProgression({
        engine: ENGINE.LEARNER,
        progressionContent: {
          type: CONTENT_TYPE.LEVEL,
          ref: 'mod_10B'
        }
      });

      const partialState = {
        data: {
          progressions: {
            entities: {
              progression1: {...progression, state: {...progression.state}}
            }
          }
        },
        ui: {
          current: {
            progressionId: 'progression1'
          }
        }
      };
      const state: StoreState = createState({
        engine: ENGINE.LEARNER,
        levelRef: 'mod_10B'
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
            end: 30
          }
        }
      };

      // $FlowFixMe
      const bestScore = getBestRank(state);
      expect(bestScore).toEqual('-10');
    });
    it('should return null if start and end are equal', () => {
      const state = {
        data: {
          rank: {
            start: 20,
            end: 20
          }
        }
      };

      // $FlowFixMe
      const bestScore = getBestRank(state);
      expect(bestScore).toEqual(null);
    });
    it('should return +score if end < start', () => {
      const state = {
        data: {
          rank: {
            start: 20,
            end: 10
          }
        }
      };

      // $FlowFixMe
      const bestScore = getBestRank(state);
      expect(bestScore).toEqual('+10');
    });
  });

  describe('getCard', () => {
    it('should get card', () => {
      const state = {
        authentication: {
          language: 'en'
        },
        catalog: {
          entities: {
            cards: {
              foo: {
                en: 'card'
              }
            }
          }
        }
      };
      // $FlowFixMe
      const result = getCard(state, 'foo', 'en');
      expect(result).toEqual('card');
    });
  });

  describe('getSection', () => {
    it('should get section', () => {
      const state = {
        authentication: {
          language: 'en'
        },
        catalog: {
          entities: {
            sections: {
              foo: {
                en: 'section'
              }
            }
          }
        }
      };
      // $FlowFixMe
      const result = getSection(state, 'foo', 'en');
      expect(result).toEqual('section');
    });

    it('should get section with default lang', () => {
      const state = {
        authentication: {
          language: 'en'
        },
        catalog: {
          entities: {
            sections: {
              foo: {
                en: 'section'
              }
            }
          }
        }
      };
      // $FlowFixMe
      const result = getSection(state, 'foo');
      expect(result).toEqual('section');
    });
  });

  describe('getToken', () => {
    it('should get token', () => {
      const state = {
        authentication: {
          user: {
            token: 'foo'
          }
        }
      };
      // $FlowFixMe
      const result = getToken(state);
      expect(result).toEqual('foo');
    });
  });

  describe('getBrand', () => {
    it('should get brand', () => {
      const state = createState({});

      const result = getBrand(state);
      const expected = brand;

      expect(result).toEqual(expected);
    });
  });

  describe('getEngineVersions', () => {
    it('should get engine versions if brand is defined', () => {
      const state = createState({});

      const result = getEngineVersions(state);
      const expected: ProgressionEngineVersions = {
        versions: {
          [ENGINE.LEARNER]: '2',
          [ENGINE.MICROLEARNING]: '2'
        }
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
        slides: [slide]
      });

      const result = getContext(state);
      const expected = context;

      expect(result).toEqual(expected);
    });
  });
});
