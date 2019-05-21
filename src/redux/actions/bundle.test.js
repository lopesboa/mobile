// @flow strict

import {createDisciplineCard, createChapterCard, createCardLevel} from '../../__fixtures__/cards';
import {CARD_STATUS, CARD_TYPE} from '../../layer/data/_const';
import {
  FETCH_REQUEST,
  FETCH_SUCCESS,
  FETCH_ERROR,
  fetchRequest,
  fetchSuccess,
  fetchError,
  fetchBundles
} from './bundle';
import type {Action} from './bundle';

const level = createCardLevel({ref: 'mod_1', status: CARD_STATUS.ACTIVE, label: 'Fake level'});
const disciplineCard = createDisciplineCard({
  ref: 'dis1',
  completion: 0,
  levels: [level],
  title: 'Discipline'
});
const chapterCard = createChapterCard({
  ref: 'cha1',
  completion: 0,
  status: CARD_STATUS.ACTIVE,
  title: 'Chapter'
});

describe('Bundle', () => {
  it('fetchRequest', () => {
    const ref = 'foobarbaz';
    const languages = ['en', 'de', 'it', 'ja'];
    const result = fetchRequest(CARD_TYPE.COURSE, ref, languages);
    const expected: Action = {
      type: FETCH_REQUEST,
      payload: {
        type: CARD_TYPE.COURSE,
        ref,
        languages: ['en', 'de', 'it', 'ja']
      }
    };
    expect(result).toEqual(expected);
  });

  it('fetchSuccess', () => {
    const languages = ['en', 'de', 'it', 'ja'];
    const result = fetchSuccess(
      {dis1: languages, dis2: languages},
      {cha1: languages, cha2: languages}
    );
    const expected: Action = {
      type: FETCH_SUCCESS,
      payload: {
        disciplines: {
          dis1: languages,
          dis2: languages
        },
        chapters: {
          cha1: languages,
          cha2: languages
        }
      }
    };
    expect(result).toEqual(expected);
  });

  it('fetchError', () => {
    const type = CARD_TYPE.COURSE;
    const ref = 'foobarbaz';
    const languages = ['en', 'de', 'it', 'ja'];
    const result = fetchError(type, ref, languages);
    const expected: Action = {
      type: FETCH_ERROR,
      payload: {
        type,
        ref,
        languages
      }
    };
    expect(result).toEqual(expected);
  });

  describe('fetchBundles', () => {
    it('fetch bundles of cards', async () => {
      const cards = [disciplineCard, chapterCard];
      const dispatch = jest.fn();

      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(
          fetchRequest(CARD_TYPE.COURSE, disciplineCard.universalRef, ['en', 'de'])
        );
        return Promise.resolve(action);
      });

      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(
          fetchRequest(CARD_TYPE.CHAPTER, chapterCard.universalRef, ['en', 'de'])
        );
        return Promise.resolve(action);
      });

      // $FlowFixMe
      const actual = await fetchBundles(cards, ['en', 'de'])(dispatch);
      expect(actual).toBeUndefined();

      expect(dispatch).toHaveBeenCalledTimes(2);
    });
  });
});
