// @flow strict

import {createDisciplineCard, createChapterCard, createCardLevel} from '../../__fixtures__/cards';
import {CARD_STATUS} from '../../layer/data/_const';
import {
  FETCH_REQUEST,
  FETCH_SUCCESS,
  FETCH_ERROR,
  fetchRequest,
  fetchSuccess,
  fetchError,
  fetchBundles
} from './discipline-bundle';
import type {Action} from './discipline-bundle';

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

describe('Discipline bundle', () => {
  it('fetchRequest', () => {
    const ref = 'foobarbaz';
    const languages = ['en', 'de', 'it', 'ja'];
    const result = fetchRequest(ref, languages);
    const expected: Action = {
      type: FETCH_REQUEST,
      payload: {
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
    const ref = 'foobarbaz';
    const languages = ['en', 'de', 'it', 'ja'];
    const result = fetchError(ref, languages);
    const expected: Action = {
      type: FETCH_ERROR,
      payload: {
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
        expect(action).toEqual(fetchRequest(disciplineCard.universalRef, ['en', 'de']));
        return Promise.resolve(action);
      });

      // $FlowFixMe
      const actual = await fetchBundles(cards, ['en', 'de'])(dispatch);
      expect(actual).toBeUndefined();

      expect(dispatch).toHaveBeenCalledTimes(1);
    });
  });
});
