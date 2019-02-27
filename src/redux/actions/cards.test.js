// @flow strict

import {createDisciplineCard} from '../../__fixtures__/cards';
import type {DisciplineCard, ChapterCard} from '../../layer/data/_types';
import {
  FETCH_REQUEST,
  FETCH_SUCCESS,
  FETCH_ERROR,
  SELECT_CARD,
  SELECT_CARD_FAILURE,
  fetchRequest,
  fetchSuccess,
  fetchError,
  selectCard,
  selectCardFailure
} from './cards';
import type {
  Action,
  FetchRequestPayload,
  FetchSuccessPayload,
  FetchErrorPayload,
  SelectCardPayload,
  SelectCardFailurePayload
} from './cards';

const disciplineCard = createDisciplineCard({
  ref: 'dis1',
  levels: [],
  completion: 0,
  title: 'Fake discipline'
});

describe('Cards', () => {
  it('fetchRequest', () => {
    const result = fetchRequest('de');
    const expectedPayload: FetchRequestPayload = {
      language: 'de'
    };
    const expected: Action = {
      type: FETCH_REQUEST,
      payload: expectedPayload
    };
    expect(result).toEqual(expected);
  });

  it('fetchSuccess', () => {
    const items: Array<DisciplineCard | ChapterCard> = [];
    const result = fetchSuccess(items, 'ja');
    const expectedPayload: FetchSuccessPayload = {
      items,
      language: 'ja'
    };
    const expected: Action = {
      type: FETCH_SUCCESS,
      payload: expectedPayload
    };
    expect(result).toEqual(expected);
  });

  it('fetchError', () => {
    const result = fetchError('Foo bar baz');
    const expectedPayload: FetchErrorPayload = {
      error: 'Foo bar baz'
    };
    const expected: Action = {
      type: FETCH_ERROR,
      payload: expectedPayload
    };
    expect(result).toEqual(expected);
  });

  it('selectCard', () => {
    const result = selectCard(disciplineCard);
    const expectedPayload: SelectCardPayload = {
      item: disciplineCard
    };
    const expected: Action = {
      type: SELECT_CARD,
      payload: expectedPayload
    };
    expect(result).toEqual(expected);
  });

  it('selectCardFailure', () => {
    const result = selectCardFailure(disciplineCard, 'Fake error');
    const expectedPayload: SelectCardFailurePayload = {
      item: disciplineCard,
      error: 'Fake error'
    };
    const expected: Action = {
      type: SELECT_CARD_FAILURE,
      payload: expectedPayload
    };
    expect(result).toEqual(expected);
  });
});
