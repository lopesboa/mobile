import {
  createDisciplineCard,
  createChapterCard,
  createCardLevel,
} from '../../../../__fixtures__/cards';
import {createChapter} from '../../../../__fixtures__/chapters';
import {createBrand} from '../../../../__fixtures__/brands';
import {createAuthenticationState} from '../../../../__fixtures__/store';
import {CARD_TYPE, CARD_STATUS} from '../../../../layer/data/_const';
import {SHOW} from '../../ui/errors';
import {CONTENT_TYPE, ERROR_TYPE} from '../../../../const';
import {NotFoundError} from '../../../../models/error';
import {selectRequest, selectSuccess, selectError, selectCard} from './select';

const chapter = createChapter({
  ref: 'cha1',
  name: 'chapter1',
});

const level = createCardLevel({
  ref: 'mod_1',
  status: CARD_STATUS.ACTIVE,
  label: 'Fake level',
});
const disciplineCard = createDisciplineCard({
  ref: 'dis1',
  completion: 0,
  levels: [level],
  title: 'Discipline',
});
const chapterCard = createChapterCard({
  ref: 'cha1',
  completion: 0,
  status: CARD_STATUS.ACTIVE,
  title: 'Chapter',
});

const noToken = {
  name: 'No token',
  authentication: createAuthenticationState({
    token: null,
    brand: createBrand({host: 'digital'}),
  }),
};

const noBrand = {
  name: 'No brand',
  authentication: createAuthenticationState({
    token: '__TOURTE__',
    brand: null,
  }),
};

const mockNoContent = (expectedType) =>
  jest.fn().mockImplementationOnce((type) => {
    expect(type).toEqual(expectedType);
    // @ts-ignore
    return null;
  });

const Bundle = {
  store: jest.fn().mockImplementationOnce((bundle) => {
    expect(bundle).toEqual('bundle');
    // @ts-ignore
    return;
  }),
  findById: jest.fn().mockImplementationOnce((bundleType, universalRef, token, host) => {
    expect(bundleType).toEqual(CONTENT_TYPE.DISCIPLINE);
    expect(universalRef).toEqual(disciplineCard.universalRef);
    expect(token).toEqual('foo');
    expect(host).toEqual('digital');
    // @ts-ignore
    return 'bundle';
  }),
};

jest.mock('../../progressions/create-next-progression', () => ({
  createNextProgression: jest.fn(() =>
    Promise.resolve({
      type: '@@mock/CREATE_NEXT_PROGRESSION',
      meta: {type: 'level', ref: 'mod_1'},
    }),
  ),
}));

describe('Cards', () => {
  [disciplineCard, chapterCard].map((card) =>
    it(`should selectCard successfully when content is ready | type: ${card.type}`, async () => {
      const dispatch = jest.fn();
      const getState = jest.fn();
      const options = {
        services: {
          Content: {
            find: jest.fn().mockImplementationOnce((type) => {
              switch (type) {
                case CONTENT_TYPE.LEVEL:
                  expect(card.type).toEqual(CARD_TYPE.COURSE);
                  return level;
                case CONTENT_TYPE.CHAPTER:
                  expect(card.type).toEqual(CARD_TYPE.CHAPTER);
                  return chapter;
                default:
                  return Promise.resolve();
              }
            }),
          },
        },
      };

      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(selectRequest(card));
        return action;
      });

      dispatch.mockImplementationOnce(async (action) => {
        expect(await action).toEqual({
          type: '@@mock/CREATE_NEXT_PROGRESSION',
          meta: {type: 'level', ref: 'mod_1'},
        });
        // @ts-ignore
        return action;
      });

      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(selectSuccess(card));
        return action;
      });

      // @ts-ignore
      const result = await selectCard(card)(dispatch, getState, options);
      return expect(result).toEqual(selectSuccess(card));
    }),
  );

  [disciplineCard, chapterCard].map((card) =>
    it(`should selectCard successfully after fetching content | type: ${card.type}`, async () => {
      const dispatch = jest.fn();
      const getState = () => ({
        authentication: createAuthenticationState({
          token: 'foo',
          brand: createBrand({host: 'digital'}),
        }),
      });

      const options = {
        services: {
          Content: {
            find: jest
              .fn()
              .mockImplementationOnce((type) => {
                switch (type) {
                  case CONTENT_TYPE.LEVEL:
                    expect(card.type).toEqual(CARD_TYPE.COURSE);
                    // @ts-ignore
                    return null;
                  case CONTENT_TYPE.CHAPTER:
                    expect(card.type).toEqual(CARD_TYPE.CHAPTER);
                    // @ts-ignore
                    return null;
                  default:
                    // @ts-ignore
                    return Promise.resolve();
                }
              })
              .mockImplementationOnce((type) => {
                switch (type) {
                  case CONTENT_TYPE.LEVEL:
                    expect(card.type).toEqual(CARD_TYPE.COURSE);
                    // @ts-ignore
                    return () => level;
                  case CONTENT_TYPE.CHAPTER:
                    expect(card.type).toEqual(CARD_TYPE.CHAPTER);
                    // @ts-ignore
                    return () => chapter;
                  default:
                    // @ts-ignore
                    return () => Promise.resolve();
                }
              }),
          },
          Bundle,
        },
      };

      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(selectRequest(card));
        return action;
      });

      dispatch.mockImplementationOnce(async (action) => {
        expect(await action).toEqual({
          type: '@@mock/CREATE_NEXT_PROGRESSION',
          meta: {type: 'level', ref: 'mod_1'},
        });
        // @ts-ignore
        return action;
      });

      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(selectSuccess(card));
        return action;
      });

      // @ts-ignore
      const result = await selectCard(card)(dispatch, getState, options);
      return expect(result).toEqual(selectSuccess(card));
    }),
  );

  it('should fail selectCard when card type is wrong', async () => {
    const dispatch = jest.fn();
    const getState = () => ({
      authentication: createAuthenticationState({
        token: 'tourte',
        brand: createBrand({host: 'digital'}),
      }),
    });
    const options = {
      services: {
        Content: {
          find: mockNoContent(CONTENT_TYPE.LEVEL),
        },
      },
    };

    dispatch.mockImplementationOnce((action) => {
      // @ts-ignore
      expect(action).toEqual(selectRequest({}));
      return action;
    });

    dispatch.mockImplementationOnce((action) => {
      expect(action).toEqual(selectError(new Error('Card type not handled')));
      return action;
    });

    // @ts-ignore
    const result = await selectCard({})(dispatch, getState, options);
    return expect(result).toEqual(selectError(new Error('Card type not handled')));
  });

  it('should fail selectCard when discipline card when level is wrong', async () => {
    const dispatch = jest.fn();
    const getState = jest.fn();
    const options = {
      services: {
        Content: {
          find: jest.fn(),
        },
      },
    };

    const card = createDisciplineCard({
      ref: 'dis1',
      completion: 0,
      // @ts-ignore
      levels: [null],
      title: 'Discipline',
    });

    dispatch.mockImplementationOnce((action) => {
      // @ts-ignore
      expect(action).toEqual(selectRequest(card));
      return action;
    });

    dispatch.mockImplementationOnce((action) => {
      expect(action).toEqual(selectError(new Error('Course has no level')));
      return action;
    });

    // @ts-ignore
    const result = await selectCard(card)(dispatch, getState, options);
    return expect(result).toEqual(selectError(new Error('Course has no level')));
  });

  it('should fail selectCard when content could not be fetched : level.universalRef is not defined', async () => {
    const dispatch = jest.fn();
    const getState = () => ({
      authentication: createAuthenticationState({
        token: 'tourte',
        brand: createBrand({host: 'digital'}),
      }),
    });
    const options = {
      services: {
        Content: {
          find: mockNoContent(CONTENT_TYPE.LEVEL),
        },
      },
    };

    const badLevel = {
      ...level,
      universalRef: null,
    };

    const card = createDisciplineCard({
      ref: 'dis1',
      completion: 0,
      // @ts-ignore
      levels: [badLevel],
      title: 'Discipline',
    });

    const error = new NotFoundError(
      `No Content Found for card with universalRef ${card.universalRef}`,
    );
    const modal = {
      type: SHOW,
      payload: {
        type: ERROR_TYPE.NO_CONTENT_FOUND,
        lastAction: expect.any(Function),
      },
    };

    dispatch.mockImplementationOnce((action) => {
      // @ts-ignore
      expect(action).toEqual(selectRequest(card));
      return action;
    });

    dispatch.mockImplementationOnce((action) => {
      expect(action).toEqual(modal);
      return action;
    });

    dispatch.mockImplementationOnce((action) => {
      expect(action).toEqual(selectError(error));
      return action;
    });

    // @ts-ignore
    const result = await selectCard(card)(dispatch, getState, options);
    return expect(result).toEqual(selectError(error));
  });

  [noToken, noBrand].map((mockedState) =>
    it(`should fail selectCard when content could not be fetched : ${mockedState.name}`, async () => {
      const dispatch = jest.fn();
      const getState = () => mockedState;
      const options = {
        services: {
          Content: {
            find: mockNoContent(CONTENT_TYPE.LEVEL),
          },
        },
      };

      const error = new Error('Chapter progression not created - no token or brand provided');

      dispatch.mockImplementationOnce((action) => {
        // @ts-ignore
        expect(action).toEqual(selectRequest(disciplineCard));
        return action;
      });

      dispatch.mockImplementationOnce((action) => {
        expect(action).toEqual(selectError(error));
        return action;
      });

      // @ts-ignore
      const result = await selectCard(disciplineCard)(dispatch, getState, options);
      return expect(result).toEqual(selectError(error));
    }),
  );

  it('should fail selectCard when content could not be fetched, and show a modal', async () => {
    const dispatch = jest.fn();
    const getState = () => ({
      authentication: createAuthenticationState({
        token: 'tourte',
        brand: createBrand({host: 'digital'}),
      }),
    });
    const options = {
      services: {
        Content: {
          find: jest
            .fn()
            .mockImplementationOnce((type) => {
              expect(type).toEqual(CONTENT_TYPE.LEVEL);
              // @ts-ignore
              return null;
            })
            .mockImplementationOnce((type) => {
              expect(type).toEqual(CONTENT_TYPE.LEVEL);
              // @ts-ignore
              return null;
            }),
        },
        Bundle,
      },
    };

    const error = new NotFoundError(
      `No Content Found for card with universalRef ${disciplineCard.universalRef}`,
    );

    const modal = {
      type: SHOW,
      payload: {
        type: ERROR_TYPE.NO_CONTENT_FOUND,
        lastAction: expect.any(Function),
      },
    };

    dispatch.mockImplementationOnce((action) => {
      // @ts-ignore
      expect(action).toEqual(selectRequest(disciplineCard));
      return action;
    });

    let errorAction;
    dispatch.mockImplementationOnce((action) => {
      errorAction = action;
      expect(action).toEqual(modal);
      return action;
    });

    dispatch.mockImplementationOnce((action) => {
      expect(action).toEqual(selectError(error));
      return action;
    });

    // @ts-ignore
    const result = await selectCard(disciplineCard)(dispatch, getState, options);
    expect(result).toEqual(selectError(error));

    // @ts-ignore
    const newResult = await errorAction.payload.lastAction()(dispatch, getState, options);
    return expect(newResult).toEqual(undefined);
  });
});
