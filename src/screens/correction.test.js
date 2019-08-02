// @flow

import {createStoreState} from '../__fixtures__/store';
import {createLevel} from '../__fixtures__/levels';
import {createQCMGraphic} from '../__fixtures__/questions';
import {createSlide} from '../__fixtures__/slides';
import {createProgression} from '../__fixtures__/progression';
import type {StateExtension} from '../__fixtures__/progression';

import {CONTENT_TYPE, SPECIFIC_CONTENT_REF} from '../const';
import {goNext, mapStateToProps} from './correction';

const levelRef = 'dummyLevelRef';
const slideRef = 'dummySlideRef';
const level = createLevel({ref: levelRef, chapterIds: ['666']});
const question = createQCMGraphic({});
const slide = createSlide({
  ref: slideRef,
  chapterId: '666',
  chapterIds: ['666'],
  question
});

const createStore = (state?: StateExtension) => {
  const progression = createProgression({
    engine: 'learner',
    progressionContent: {
      type: CONTENT_TYPE.SLIDE,
      ref: slideRef
    },
    state: state || undefined
  });

  const mockedStore = createStoreState({
    levels: [level],
    disciplines: [],
    chapters: [],
    slides: [slide, slide],
    progression
  });

  return mockedStore;
};

describe('correction', () => {
  it('should display success correction', () => {
    const mockedStore = createStore({
      nextContent: {
        type: CONTENT_TYPE.SLIDE,
        ref: slideRef
      }
    });

    const expectedProps = {
      nextScreen: undefined,
      isFinished: false,
      canGoNext: true,
      isCorrect: true,
      isResourceViewed: false,
      showResourcesFirst: false,
      lives: 4,
      progressionId: 'progression1',
      offeringExtraLife: false,
      consumedExtraLife: false
    };

    const props = mapStateToProps(mockedStore);
    expect(props).toEqual(expectedProps);
  });

  it('should display failure correction with remaining lives', () => {
    const mockedStore = createStore({
      nextContent: {
        type: CONTENT_TYPE.SLIDE,
        ref: slideRef
      },
      isCorrect: false,
      lives: 2
    });

    const expectedProps = {
      canGoNext: true,
      nextScreen: undefined,
      isFinished: false,
      isCorrect: false,
      isResourceViewed: false,
      showResourcesFirst: false,
      lives: 2,
      progressionId: 'progression1',
      offeringExtraLife: false,
      consumedExtraLife: false
    };

    const props = mapStateToProps(mockedStore);
    expect(props).toEqual(expectedProps);
  });

  it('should offer extra life', () => {
    const mockedStore = createStore({
      nextContent: {
        type: CONTENT_TYPE.NODE,
        ref: SPECIFIC_CONTENT_REF.EXTRA_LIFE
      },
      isCorrect: false,
      lives: 0
    });

    const expectedProps = {
      canGoNext: false,
      nextScreen: undefined,
      isFinished: true,
      isCorrect: false,
      isResourceViewed: false,
      showResourcesFirst: true,
      lives: 0,
      progressionId: 'progression1',
      offeringExtraLife: true,
      consumedExtraLife: false
    };

    const props = mapStateToProps(mockedStore);
    expect(props).toEqual(expectedProps);
  });

  it('should consume extra life', () => {
    const mockedStore = createStore({
      nextContent: {
        type: CONTENT_TYPE.NODE,
        ref: SPECIFIC_CONTENT_REF.EXTRA_LIFE
      },
      isCorrect: false,
      lives: 0,
      hasViewedAResourceAtThisStep: true
    });

    const expectedProps = {
      nextScreen: undefined,
      canGoNext: true,
      isFinished: false,
      isCorrect: false,
      isResourceViewed: false,
      showResourcesFirst: true,
      lives: 1,
      progressionId: 'progression1',
      offeringExtraLife: false,
      consumedExtraLife: true
    };

    const props = mapStateToProps(mockedStore);
    expect(props).toEqual(expectedProps);
  });

  it('should accept extra life', async () => {
    const mockedStore = createStore({
      nextContent: {
        type: CONTENT_TYPE.NODE,
        ref: SPECIFIC_CONTENT_REF.EXTRA_LIFE
      },
      isCorrect: false,
      lives: 0,
      hasViewedAResourceAtThisStep: true
    });

    const props = {
      ...mapStateToProps(mockedStore),
      acceptExtraLife: jest.fn(),
      refuseExtraLife: jest.fn()
    };

    await goNext(() => props);
    expect(props.refuseExtraLife.mock.calls.length).toBe(0);
    expect(props.acceptExtraLife.mock.calls.length).toBe(1);
  });

  it('should refuse extra life, and go to end screen on failure', async () => {
    const mockedStore = createStore({
      nextContent: {
        type: CONTENT_TYPE.NODE,
        ref: SPECIFIC_CONTENT_REF.EXTRA_LIFE
      },
      isCorrect: false,
      lives: 0,
      hasViewedAResourceAtThisStep: false
    });

    const props = {
      ...mapStateToProps(mockedStore),
      acceptExtraLife: jest.fn(),
      refuseExtraLife: jest.fn(),
      navigation: {
        navigate: jest.fn() // navigate to level-end
      }
    };

    await goNext(() => props);
    expect(props.refuseExtraLife.mock.calls.length).toBe(1);
    expect(props.acceptExtraLife.mock.calls.length).toBe(0);
    expect(props.navigation.navigate.mock.calls.length).toBe(1);
    expect(props.navigation.navigate.mock.calls[0]).toEqual([
      'LevelEnd',
      {isCorrect: false, progressionId: 'progression1'}
    ]);
  });

  it('should close correction and proceed to question', async () => {
    const mockedStore = createStore({
      nextContent: {
        type: CONTENT_TYPE.SLIDE,
        ref: slideRef
      },
      isCorrect: false,
      lives: 1,
      hasViewedAResourceAtThisStep: false
    });

    const props = {
      ...mapStateToProps(mockedStore),
      selectCurrentProgression: jest.fn(),
      navigation: {
        navigate: jest.fn() // navigate to level-end
      }
    };

    await goNext(() => props);
    expect(props.selectCurrentProgression.mock.calls.length).toBe(1);
    expect(props.navigation.navigate.mock.calls.length).toBe(0);
  });

  it('should close correction and quit to success end screen', async () => {
    const mockedStore = createStore({
      nextContent: {
        type: CONTENT_TYPE.SUCCESS,
        ref: SPECIFIC_CONTENT_REF.SUCCESS_EXIT_NODE
      },
      isCorrect: false,
      lives: 2,
      hasViewedAResourceAtThisStep: false
    });

    const props = {
      ...mapStateToProps(mockedStore),
      selectCurrentProgression: jest.fn(),
      navigation: {
        navigate: jest.fn() // navigate to level-end
      }
    };

    await goNext(() => props);
    expect(props.selectCurrentProgression.mock.calls.length).toBe(1);
    expect(props.navigation.navigate.mock.calls.length).toBe(1);
    expect(props.navigation.navigate.mock.calls[0]).toEqual([
      'LevelEnd',
      {isCorrect: true, progressionId: 'progression1'}
    ]);
  });

  it('should close correction and quit to fail end screen', async () => {
    const mockedStore = createStore({
      nextContent: {
        type: CONTENT_TYPE.FAILURE,
        ref: SPECIFIC_CONTENT_REF.FAILURE_EXIT_NODE
      },
      isCorrect: false,
      lives: 0,
      hasViewedAResourceAtThisStep: false
    });

    const props = {
      ...mapStateToProps(mockedStore),
      selectCurrentProgression: jest.fn(),
      navigation: {
        navigate: jest.fn() // navigate to level-end
      }
    };

    await goNext(() => props);
    expect(props.selectCurrentProgression.mock.calls.length).toBe(1);
    expect(props.navigation.navigate.mock.calls.length).toBe(1);
    expect(props.navigation.navigate.mock.calls[0]).toEqual([
      'LevelEnd',
      {isCorrect: false, progressionId: 'progression1'}
    ]);
  });

  it('should close correction and quit to success end screen thanks to extra life', async () => {
    const mockedStore = createStore({
      nextContent: {
        type: CONTENT_TYPE.NODE,
        ref: SPECIFIC_CONTENT_REF.EXTRA_LIFE
      },
      isCorrect: false,
      lives: 0,
      hasViewedAResourceAtThisStep: true
    });

    let props = {
      ...mapStateToProps(mockedStore),
      acceptExtraLife: () => {
        const newStore = createStore({
          content: {
            type: CONTENT_TYPE.NODE,
            ref: SPECIFIC_CONTENT_REF.EXTRA_LIFE
          },
          nextContent: {
            type: CONTENT_TYPE.SUCCESS,
            ref: SPECIFIC_CONTENT_REF.SUCCESS_EXIT_NODE
          },
          isCorrect: false,
          lives: 1,
          hasViewedAResourceAtThisStep: false
        });

        props = {
          ...props,
          ...mapStateToProps(newStore)
        };

        expect(props.lives).toEqual(1);
        expect(props.canGoNext).toEqual(true);
        expect(props.offeringExtraLife).toEqual(false);
        expect(props.consumedExtraLife).toEqual(false);
        expect(props.showResourcesFirst).toEqual(true);
        return Promise.resolve(true);
      },
      navigation: {
        navigate: jest.fn() // navigate to level-end
      }
    };

    expect(props.lives).toEqual(1);
    expect(props.canGoNext).toEqual(true);
    expect(props.offeringExtraLife).toEqual(false);
    expect(props.consumedExtraLife).toEqual(true);
    expect(props.showResourcesFirst).toEqual(true);

    await goNext(() => props);
    expect(props.navigation.navigate.mock.calls.length).toBe(1);
    expect(props.navigation.navigate.mock.calls[0]).toEqual([
      'LevelEnd',
      {isCorrect: true, progressionId: 'progression1'}
    ]);
  });
});
