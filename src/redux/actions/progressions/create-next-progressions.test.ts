import {CONTENT_TYPE, ENGINE} from '../../../const';
import {createStoreState, createAuthenticationState} from '../../../__fixtures__/store';
import {createProgression} from '../../../__fixtures__/progression';

const getState = () =>
  createStoreState({
    levels: [],
    disciplines: [],
    chapters: [],
    slides: [],
    progression: createProgression({
      engine: ENGINE.MICROLEARNING,
      progressionContent: {
        type: CONTENT_TYPE.LEVEL,
        ref: '',
      },
    }),
    authentication: createAuthenticationState({}),
  });

jest.mock('./create-chapter-progression', () => ({
  createChapterProgression: jest.fn(() => ({
    type: '@@mock/CREATE_PROGRESSION',
    payload: {
      _id: '__PROG_ID__',
    },
  })),
}));

jest.mock('./create-level-progression', () => ({
  createLevelProgression: jest.fn(() => ({
    type: '@@mock/CREATE_PROGRESSION',
    payload: {
      _id: '__PROG_ID__',
    },
  })),
}));

jest.mock('@coorpacademy/player-store', () => ({
  selectProgression: jest.fn(() => ({type: '@@mock/SELECT_PROGRESSION'})),
  fetchBestProgression: jest.fn(() => ({type: '@@mock/FETCH_BEST_PROGRESSION'})),
}));

describe('createNextProgression', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  [CONTENT_TYPE.CHAPTER, CONTENT_TYPE.LEVEL].forEach((contentType) => {
    const isChapter = contentType === CONTENT_TYPE.CHAPTER;

    it(`should create a new ${contentType} progression`, async () => {
      const {createChapterProgression} = require('./create-chapter-progression');
      const {createLevelProgression} = require('./create-level-progression');
      const {selectProgression, fetchBestProgression} = require('@coorpacademy/player-store');

      const {
        CREATE_NEXT_REQUEST,
        CREATE_NEXT_SUCCESS,
        createNextProgression,
      } = require('./create-next-progression');

      const dispatch = jest.fn((action) => action);
      const options = {
        services: {
          Content: {
            find: jest.fn(() => Promise.resolve({id: '__CONTENT_ID__'})),
          },
          Progressions: {
            findLast: jest.fn(() => Promise.resolve(null)),
          },
        },
      };

      // @ts-ignore wrong type
      await createNextProgression(contentType, 'foo')(dispatch, getState, options);

      expect(dispatch).toHaveBeenCalledTimes(5);
      expect(dispatch.mock.calls[0][0]).toEqual({
        type: CREATE_NEXT_REQUEST,
        meta: {ref: 'foo', type: contentType},
      });
      expect(dispatch.mock.calls[1][0]).toEqual({
        type: '@@mock/CREATE_PROGRESSION',
        payload: {_id: '__PROG_ID__'},
      });
      expect(dispatch.mock.calls[2][0]).toEqual({
        type: '@@mock/SELECT_PROGRESSION',
      });
      expect(dispatch.mock.calls[3][0]).toEqual({
        type: '@@mock/FETCH_BEST_PROGRESSION',
      });
      expect(dispatch.mock.calls[4][0]).toEqual({
        type: CREATE_NEXT_SUCCESS,
        meta: {ref: 'foo', type: contentType},
      });

      const progressionCreator = isChapter ? createChapterProgression : createLevelProgression;

      expect(progressionCreator).toHaveBeenCalledTimes(1);
      expect(progressionCreator).toHaveBeenCalledWith({id: '__CONTENT_ID__'}, '2');
      expect(selectProgression).toHaveBeenCalledTimes(1);
      expect(selectProgression).toHaveBeenCalledWith('__PROG_ID__');
      expect(fetchBestProgression).toHaveBeenCalledTimes(1);
      expect(fetchBestProgression).toHaveBeenCalledWith(
        {type: contentType, ref: 'foo'},
        '__PROG_ID__',
        true,
      );
    });

    it(`should resume a ${contentType} progression`, async () => {
      const {createChapterProgression} = require('./create-chapter-progression');
      const {createLevelProgression} = require('./create-level-progression');
      const {selectProgression, fetchBestProgression} = require('@coorpacademy/player-store');

      const {
        CREATE_NEXT_REQUEST,
        CREATE_NEXT_SUCCESS,
        createNextProgression,
      } = require('./create-next-progression');

      const dispatch = jest.fn((action) => action);
      const options = {
        services: {
          Content: {
            find: jest.fn(() => Promise.resolve({id: '__CONTENT_ID__'})),
          },
          Progressions: {
            findLast: jest.fn(() => Promise.resolve({_id: '__LAST_PROG_ID__'})),
          },
        },
      };

      // @ts-ignore wrong type
      await createNextProgression(contentType, 'foo')(dispatch, getState, options);

      expect(dispatch).toHaveBeenCalledTimes(4);
      expect(dispatch.mock.calls[0][0]).toEqual({
        type: CREATE_NEXT_REQUEST,
        meta: {ref: 'foo', type: contentType},
      });
      expect(dispatch.mock.calls[1][0]).toEqual({
        type: '@@mock/SELECT_PROGRESSION',
      });
      expect(dispatch.mock.calls[2][0]).toEqual({
        type: '@@mock/FETCH_BEST_PROGRESSION',
      });
      expect(dispatch.mock.calls[3][0]).toEqual({
        type: CREATE_NEXT_SUCCESS,
        meta: {ref: 'foo', type: contentType},
      });

      const progressionCreator = isChapter ? createChapterProgression : createLevelProgression;

      expect(progressionCreator).toHaveBeenCalledTimes(0);
      expect(selectProgression).toHaveBeenCalledTimes(1);
      expect(selectProgression).toHaveBeenCalledWith('__LAST_PROG_ID__');
      expect(fetchBestProgression).toHaveBeenCalledTimes(1);
      expect(fetchBestProgression).toHaveBeenCalledWith(
        {type: contentType, ref: 'foo'},
        '__LAST_PROG_ID__',
        true,
      );
    });

    it(`should fail if no ${contentType} progression has been created`, async () => {
      const {createChapterProgression} = require('./create-chapter-progression');
      const {createLevelProgression} = require('./create-level-progression');
      const {selectProgression, fetchBestProgression} = require('@coorpacademy/player-store');

      const {
        CREATE_NEXT_REQUEST,
        CREATE_NEXT_FAILURE,
        createNextProgression,
      } = require('./create-next-progression');

      const dispatch = jest.fn((action) => action);
      const options = {
        services: {
          Content: {
            find: jest.fn(() => Promise.resolve({id: '__CONTENT_ID__'})),
          },
          Progressions: {
            findLast: jest.fn(() => Promise.resolve(null)),
          },
        },
      };

      const progressionCreator = isChapter ? createChapterProgression : createLevelProgression;
      // @ts-ignore mock function
      progressionCreator.mockImplementationOnce(() => ({}));

      // @ts-ignore wrong type
      await createNextProgression(contentType, 'foo')(dispatch, getState, options);

      expect(dispatch).toHaveBeenCalledTimes(3);
      expect(dispatch.mock.calls[0][0]).toEqual({
        type: CREATE_NEXT_REQUEST,
        meta: {ref: 'foo', type: contentType},
      });
      expect(dispatch.mock.calls[1][0]).toEqual({});
      expect(dispatch.mock.calls[2][0]).toEqual({
        error: true,
        type: CREATE_NEXT_FAILURE,
        payload: expect.any(Error),
        meta: {ref: 'foo', type: contentType},
      });

      expect(progressionCreator).toHaveBeenCalledTimes(1);
      expect(selectProgression).toHaveBeenCalledTimes(0);
      expect(fetchBestProgression).toHaveBeenCalledTimes(0);
    });
  });

  it('should fail it content type is not supported', async () => {
    const {createChapterProgression} = require('./create-chapter-progression');
    const {createLevelProgression} = require('./create-level-progression');
    const {selectProgression, fetchBestProgression} = require('@coorpacademy/player-store');

    const {
      CREATE_NEXT_REQUEST,
      CREATE_NEXT_FAILURE,
      createNextProgression,
    } = require('./create-next-progression');

    const dispatch = jest.fn((action) => action);
    const options = {
      services: {
        Content: {
          find: jest.fn(() => Promise.resolve({id: '__CONTENT_ID__'})),
        },
        Progressions: {
          findLast: jest.fn(() => Promise.resolve(null)),
        },
      },
    };

    // @ts-ignore wrong type
    await createNextProgression('qux', 'foo')(dispatch, getState, options);

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch.mock.calls[0][0]).toEqual({
      type: CREATE_NEXT_REQUEST,
      meta: {ref: 'foo', type: 'qux'},
    });
    expect(dispatch.mock.calls[1][0]).toEqual({
      error: true,
      type: CREATE_NEXT_FAILURE,
      payload: expect.any(Error),
      meta: {ref: 'foo', type: 'qux'},
    });

    expect(createLevelProgression).toHaveBeenCalledTimes(0);
    expect(createChapterProgression).toHaveBeenCalledTimes(0);
    expect(selectProgression).toHaveBeenCalledTimes(0);
    expect(fetchBestProgression).toHaveBeenCalledTimes(0);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});
