// @flow strict

import type {Content} from '@coorpacademy/progression-engine';
import type {Slide} from '../../layer/data/_types';
import type {OfflineContents, OfflineStatus} from '../reducers/bundle';
import type {Engine} from '../../types';

import {CONTENT_TYPE, SPECIFIC_CONTENT_REF, PERMISSION_STATUS} from '../../const';
import {createStoreState} from '../../__fixtures__/store';
import {createLevel} from '../../__fixtures__/levels';
import {createProgression} from '../../__fixtures__/progression';
import bundledDiscipline from '../../__fixtures__/discipline-bundle';

import {createDisciplineCard, createCardLevel} from '../../__fixtures__/cards';
import {
  isContentReady,
  getContents,
  checkIsExitNode,
  checkIsCorrect,
  checkIsValidating,
  getCurrentStep,
  getLives,
  getSlide,
  hasPermission,
  getBestRank,
  getBestScore
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
      type: 'level',
      ref: levelRef
    },
    state: {
      content,
      nextContent
    }
  });

const createState = ({
  engine = 'microlearning',
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
    progression: createDefaultProgression(engine, levelRef, content, nextContent)
  });
  return state;
};

describe('State-extract', () => {
  describe('isContentReady', () => {
    it('should return true', () => {
      const status: OfflineStatus = {
        pending: ['en'],
        ready: ['de']
      };
      const result = isContentReady('de', status);
      expect(result).toBeTruthy();
    });

    it('should return false', () => {
      const status: OfflineStatus = {
        pending: ['en'],
        ready: ['de']
      };
      const result = isContentReady('en', status);
      expect(result).toBeFalsy();
    });
  });

  describe('getContents', () => {
    it('should return filtered contents by language', () => {
      const contents: OfflineContents = {
        ref1: {
          pending: ['en'],
          ready: ['de']
        },
        ref2: {
          pending: ['pl'],
          ready: ['en']
        },
        ref3: {
          pending: ['de'],
          ready: ['it']
        }
      };
      const result = getContents('en', contents);
      expect(result).toEqual(['ref1', 'ref2']);
    });
  });

  describe('checkIsExitNode', () => {
    it('should return false if nextContent is falsy', () => {
      const state: StoreState = createState({});
      delete state.data.progressions.entities.progression1.state.nextContent;
      const result = checkIsExitNode(state);
      expect(result).toEqual(false);
    });

    it('should return true if nextContent is success', () => {
      const state: StoreState = createState({
        nextContent: {
          type: CONTENT_TYPE.SUCCESS,
          ref: SPECIFIC_CONTENT_REF.SUCCESS_EXIT_NODE
        }
      });
      const result = checkIsExitNode(state);
      expect(result).toEqual(true);
    });

    it('should return true if nextContent is failure', () => {
      const state: StoreState = createState({
        nextContent: {
          type: CONTENT_TYPE.FAILURE,
          ref: SPECIFIC_CONTENT_REF.FAILURE_EXIT_NODE
        }
      });
      const result = checkIsExitNode(state);
      expect(result).toEqual(true);
    });

    it('should return false if nextContent is a slide', () => {
      const state: StoreState = createState({
        type: CONTENT_TYPE.SLIDE,
        ref: '1234567'
      });
      const result = checkIsExitNode(state);
      expect(result).toEqual(false);
    });

    it('should return false if nextContent is extraLife', () => {
      const state: StoreState = createState({
        nextContent: {
          type: CONTENT_TYPE.NODE,
          ref: SPECIFIC_CONTENT_REF.EXTRA_LIFE
        }
      });
      const result = checkIsExitNode(state);
      expect(result).toEqual(false);
    });
  });

  describe('checkIsCorrect', () => {
    it('should return undefined if progression.state.isCorrect is null or not defined', () => {
      const state: StoreState = createState({});

      state.data.progressions.entities.progression1.state.isCorrect = null;
      expect(checkIsCorrect(state)).toEqual(undefined);

      delete state.data.progressions.entities.progression1.state;
      expect(checkIsCorrect(state)).toEqual(undefined);

      delete state.data.progressions.entities.progression1;
      expect(checkIsCorrect(state)).toEqual(undefined);
    });

    it('should return progression.state.isCorrect if defined properly', () => {
      const state: StoreState = createState({});
      expect(checkIsCorrect(state)).toEqual(true);
    });
  });

  describe('checkIsValidating', () => {
    it('should return true is route === correction', () => {
      const state: StoreState = createState({});
      state.ui.route.progression1 = 'correction';
      expect(checkIsValidating(state)).toEqual(true);
    });
  });

  describe('getSlide', () => {
    it('should return undefined if nextContent is no defined properly', () => {
      const state: StoreState = createState({});
      delete state.data.progressions.entities.progression1.state.nextContent;
      const result = getSlide(state);
      expect(result).toEqual(undefined);
    });

    it('should return currentSlide from nextContent', () => {
      const state: StoreState = createState({
        nextContent: {type: 'slide', ref: 'basic_sli_1'},
        slides: [bundledDiscipline.slides.basic_sli_1]
      });

      const slide = getSlide(state);
      // $FlowFixMe UT slide is not undefined
      expect(slide._id).toEqual(bundledDiscipline.slides.basic_sli_1._id);
    });

    it('should return previousSlide when isValidating', () => {
      const state: StoreState = createState({
        nextContent: {type: 'slide', ref: 'basic_sli_2'},
        content: {type: 'slide', ref: 'basic_sli_1'},
        slides: [bundledDiscipline.slides.basic_sli_1, bundledDiscipline.slides.basic_sli_2]
      });
      state.ui.route.progression1 = 'correction';

      const slide = getSlide(state);
      // $FlowFixMe UT slide is not undefined
      expect(slide._id).toEqual(bundledDiscipline.slides.basic_sli_1._id);
    });

    it('should return previousSlide on exit node', () => {
      const state: StoreState = createState({
        nextContent: {
          type: CONTENT_TYPE.SUCCESS,
          ref: SPECIFIC_CONTENT_REF.SUCCESS_EXIT_NODE
        },
        content: {type: 'slide', ref: 'basic_sli_1'},
        slides: [bundledDiscipline.slides.basic_sli_1, bundledDiscipline.slides.basic_sli_2]
      });
      state.ui.route.progression1 = 'correction';

      const slide = getSlide(state);
      // $FlowFixMe UT slide is not undefined
      expect(slide._id).toEqual(bundledDiscipline.slides.basic_sli_1._id);
    });

    it('should return currentSlide while waiting for correction', () => {
      const state: StoreState = createState({
        nextContent: {type: 'slide', ref: 'basic_sli_1'},
        slides: [bundledDiscipline.slides.basic_sli_1]
      });
      state.data.progressions.entities.progression1.state.isCorrect = null;

      const slide = getSlide(state);
      // $FlowFixMe UT slide is not undefined
      expect(slide._id).toEqual(bundledDiscipline.slides.basic_sli_1._id);
    });
  });

  describe('getLives', () => {
    it('should add a life when isValidating and provided a wrong answer', () => {
      const state: StoreState = createState({});
      state.ui.route.progression1 = 'correction';
      state.data.progressions.entities.progression1.state.isCorrect = false;

      const lives = getLives(state);
      expect(lives).toEqual({
        count: state.data.progressions.entities.progression1.state.lives + 1,
        hide: false
      });
    });

    it('should return state.lives when not waiting for correction', () => {
      const state: StoreState = createState({});
      state.ui.route.progression1 = 'answer';
      state.data.progressions.entities.progression1.state.isCorrect = false;

      const lives = getLives(state);
      expect(lives).toEqual({
        count: state.data.progressions.entities.progression1.state.lives,
        hide: false
      });
    });

    it('should return state.lives when waiting for correction and provided a good answer', () => {
      const state: StoreState = createState({});
      state.ui.route.progression1 = 'correction';
      state.data.progressions.entities.progression1.state.isCorrect = true;

      const lives = getLives(state);
      expect(lives).toEqual({
        count: state.data.progressions.entities.progression1.state.lives,
        hide: false
      });
    });
  });

  describe('getCurrentStep', () => {
    it('should return currentStep-1 when isValidating', () => {
      const state: StoreState = createState({});
      state.ui.route.progression1 = 'correction';

      const current = getCurrentStep(state);
      expect(current).toEqual(state.data.progressions.entities.progression1.state.step.current - 1);
    });

    it('should return currentStep when not waiting for correction', () => {
      const state: StoreState = createState({});
      state.ui.route.progression1 = 'answer';

      const current = getCurrentStep(state);
      expect(current).toEqual(state.data.progressions.entities.progression1.state.step.current);
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
    it('should get the best score', () => {
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
        engine: 'learner',
        progressionContent: {
          type: 'level',
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
        engine: 'learner',
        levelRef: 'mod_10B'
      });

      const bestScore = getBestScore({...state, ...partialState});
      expect(bestScore).toEqual('10');
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
  });
});
