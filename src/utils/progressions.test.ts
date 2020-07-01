import {ENGINE, CONTENT_TYPE} from '../const';
import {createProgression, createState, createAction} from '../__fixtures__/progression';
import {
  getCreatedAt,
  getUpdatedAt,
  isDone,
  isAlreadySynchronized,
  sortProgressionChronologicaly,
  OLDEST_DATE,
} from './progressions';

describe('progressionUtils', () => {
  it('isDone should detect if progression is done', () => {
    const progression = createProgression({
      engine: ENGINE.LEARNER,
      progressionContent: {ref: 'mod_1', type: CONTENT_TYPE.LEVEL},
    });

    expect(isDone({...progression, state: undefined})).toBe(false);
    expect(
      isDone({
        ...progression,
        state: createState({
          nextContent: {ref: 'sli_1', type: CONTENT_TYPE.SLIDE},
          livesDisabled: false,
          isCorrect: true,
          slides: [],
          lives: 4,
          step: {
            current: 1,
          },
          stars: 0,
          requestedClues: [],
          viewedResources: [],
          remainingLifeRequests: 1,
          hasViewedAResourceAtThisStep: false,
          content: {type: 'slide', ref: 'sli_foo'},
          allAnswers: [],
          variables: {},
        }),
      }),
    ).toBe(false);
    expect(
      isDone({
        ...progression,
        state: createState({
          nextContent: {ref: 'ext_1', type: CONTENT_TYPE.NODE},
          livesDisabled: false,
          isCorrect: true,
          slides: [],
          lives: 4,
          step: {
            current: 1,
          },
          stars: 0,
          requestedClues: [],
          viewedResources: [],
          remainingLifeRequests: 1,
          hasViewedAResourceAtThisStep: false,
          content: {type: 'slide', ref: 'sli_foo'},
          allAnswers: [],
          variables: {},
        }),
      }),
    ).toBe(false);

    expect(
      isDone({
        ...progression,
        state: createState({
          nextContent: {ref: 'success', type: CONTENT_TYPE.SUCCESS},
          livesDisabled: false,
          isCorrect: true,
          slides: [],
          lives: 4,
          step: {
            current: 1,
          },
          stars: 0,
          requestedClues: [],
          viewedResources: [],
          remainingLifeRequests: 1,
          hasViewedAResourceAtThisStep: false,
          content: {type: 'slide', ref: 'sli_foo'},
          allAnswers: [],
          variables: {},
        }),
      }),
    ).toBe(true);
    expect(
      isDone({
        ...progression,
        state: createState({
          nextContent: {ref: 'failure', type: CONTENT_TYPE.FAILURE},
          livesDisabled: false,
          isCorrect: true,
          slides: [],
          lives: 4,
          step: {
            current: 1,
          },
          stars: 0,
          requestedClues: [],
          viewedResources: [],
          remainingLifeRequests: 1,
          hasViewedAResourceAtThisStep: false,
          content: {type: 'slide', ref: 'sli_foo'},
          allAnswers: [],
          variables: {},
        }),
      }),
    ).toBe(true);
  });

  it('should sort progressions', () => {
    const extraOldAction = createAction({
      createdAt: '1994-09-18T08:41:37.004Z',
    });
    const newerAction = createAction({
      createdAt: '2019-09-18T08:41:37.004Z',
    });
    const olderAction = createAction({
      createdAt: '2000-01-18T08:41:37.004Z',
    });

    const newerProgression = createProgression({
      _id: 'foo',
      engine: 'learner',
      progressionContent: {
        ref: 'foo',
        type: 'chapter',
      },
      actions: [olderAction, newerAction],
    });

    const extraOldProgression = createProgression({
      _id: 'foo',
      engine: 'learner',
      progressionContent: {
        ref: 'foo',
        type: 'chapter',
      },
      actions: [extraOldAction],
    });

    const expectedResult = [extraOldProgression, newerProgression];
    const result = sortProgressionChronologicaly([newerProgression, extraOldProgression]);
    expect(result).toEqual(expectedResult);
  });

  it('should NOT sort progressions if some B is before A', () => {
    const extraOldAction = createAction({
      createdAt: '1994-09-18T08:41:37.004Z',
    });
    const newerAction = createAction({
      createdAt: '2019-09-18T08:41:37.004Z',
    });
    const olderAction = createAction({
      createdAt: '2000-01-18T08:41:37.004Z',
    });

    const newerProgression = createProgression({
      _id: 'foo',
      engine: 'learner',
      progressionContent: {
        ref: 'foo',
        type: 'chapter',
      },
      actions: [olderAction, newerAction],
    });

    const extraOldProgression = createProgression({
      _id: 'foo',
      engine: 'learner',
      progressionContent: {
        ref: 'foo',
        type: 'chapter',
      },
      actions: [extraOldAction],
    });

    const expectedResult = [extraOldProgression, newerProgression];
    const result = sortProgressionChronologicaly([newerProgression, extraOldProgression]);
    expect(result).toEqual(expectedResult);
  });

  it('should set default old date as if cannot find actions', () => {
    const newerAction = createAction({
      createdAt: '2019-09-18T08:41:37.004Z',
    });
    const olderAction = createAction({
      createdAt: '2000-01-18T08:41:37.004Z',
    });

    const newerProgression = createProgression({
      _id: 'foo',
      engine: 'learner',
      progressionContent: {
        ref: 'foo',
        type: 'chapter',
      },
      actions: [olderAction, newerAction],
    });

    const extraOldProgression = createProgression({
      _id: 'bar',
      engine: 'learner',
      progressionContent: {
        ref: 'bar',
        type: 'chapter',
      },
    });

    const expectedResult = [extraOldProgression, newerProgression];
    const result = sortProgressionChronologicaly([newerProgression, extraOldProgression]);
    expect(result).toEqual(expectedResult);

    const resultOfInvertedEntry = sortProgressionChronologicaly([
      extraOldProgression,
      newerProgression,
    ]);
    expect(resultOfInvertedEntry).toEqual(expectedResult);
  });

  it('getCreatedAt should return default old date for no actions', () => {
    const createdAt = getCreatedAt();
    expect(createdAt).toEqual(OLDEST_DATE);
  });

  it('getCreatedAt should return oldest date from provided actions', () => {
    const newerAction = createAction({
      createdAt: '2019-09-18T08:41:37.004Z',
    });
    const olderAction = createAction({
      createdAt: '2000-01-18T08:41:37.004Z',
    });
    const createdAt = getCreatedAt([newerAction, olderAction]);
    expect(createdAt).toEqual(olderAction.createdAt);
  });

  it('getCreatedAt should return default old date for no action.createdAt', () => {
    const newerAction = createAction({
      createdAt: '2019-09-18T08:41:37.004Z',
    });
    const badAction = createAction({});
    const createdAt = getCreatedAt([newerAction, badAction]);
    expect(createdAt).toEqual(OLDEST_DATE);
  });

  it('getUpdatedAt should return default old date for no actions', () => {
    const createdAt = getUpdatedAt();
    expect(createdAt).toEqual(OLDEST_DATE);
  });

  it('getUpdatedAt should return latest date from provided actions', () => {
    const newerAction = createAction({
      createdAt: '2019-09-18T08:41:37.004Z',
    });
    const olderAction = createAction({
      createdAt: '2000-01-18T08:41:37.004Z',
    });
    const createdAt = getUpdatedAt([newerAction, olderAction]);
    expect(createdAt).toEqual(newerAction.createdAt);
  });

  it('getUpdatedAt should return default old date for no action.createdAt', () => {
    const badAction = createAction({});
    const createdAt = getUpdatedAt([badAction]);
    expect(createdAt).toEqual(OLDEST_DATE);
  });

  it('getUpdatedAt should return default old date for no action.createdAt', () => {
    const newerAction = createAction({
      createdAt: '2019-09-18T08:41:37.004Z',
    });
    const badAction = createAction({});
    const createdAt = getUpdatedAt([newerAction, badAction]);
    expect(createdAt).toEqual(newerAction.createdAt);
  });

  it('isAlreadySynchronized', () => {
    const synchronizedProgressionsIds = ['1', '2', '3'];
    const progression1 = createProgression({
      _id: '1',
      engine: ENGINE.LEARNER,
      progressionContent: {ref: 'mod_1', type: CONTENT_TYPE.LEVEL},
    });
    const progression4 = createProgression({
      _id: '4',
      engine: ENGINE.LEARNER,
      progressionContent: {ref: 'mod_1', type: CONTENT_TYPE.LEVEL},
    });

    expect(isAlreadySynchronized(progression1, synchronizedProgressionsIds)).toEqual(true);
    expect(isAlreadySynchronized(progression4, synchronizedProgressionsIds)).toEqual(false);
  });
});
