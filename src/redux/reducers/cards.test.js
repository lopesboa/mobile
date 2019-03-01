// @flow strict

import {createDisciplineCard} from '../../__fixtures__/cards';
import {FETCH_SUCCESS} from '../actions/cards';
import type {Action} from '../actions/cards';
import reducer, {reduceItems} from './cards';
import type {State} from './cards';

const dis1 = createDisciplineCard({
  ref: 'dis1',
  completion: 0,
  levels: [],
  title: 'First discipline'
});
const dis2 = createDisciplineCard({
  ref: 'dis2',
  completion: 0,
  levels: [],
  title: 'Second discipline'
});

describe('Cards', () => {
  const expectedInitialState: State = {
    entities: {}
  };

  it('Default', () => {
    const action = {
      type: 'FAKE_ACTION'
    };
    // $FlowFixMe we are trying to emulate something else
    const result = reducer(undefined, action);
    expect(result).toEqual(expectedInitialState);
  });

  const reduceItemsExpected = {
    dis1: {
      en: dis1
    },
    dis2: {
      en: dis2
    }
  };

  it('reduceItems', () => {
    const result = reduceItems([dis1, dis2], 'en');
    expect(result).toEqual(reduceItemsExpected);
  });

  describe(FETCH_SUCCESS, () => {
    it('Default', () => {
      const action: Action = {
        type: FETCH_SUCCESS,
        payload: {
          items: [dis1, dis2],
          language: 'en'
        }
      };
      const result = reducer(undefined, action);
      const expected: State = {
        entities: reduceItemsExpected
      };
      expect(result).toEqual(expected);
    });
  });
});
