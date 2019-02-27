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
      fr: dis1
    },
    dis2: {
      fr: dis2
    }
  };

  it('reduceItems', () => {
    const result = reduceItems([dis1, dis2], 'fr');
    expect(result).toEqual(reduceItemsExpected);
  });

  describe(FETCH_SUCCESS, () => {
    it('Default', () => {
      const action: Action = {
        type: FETCH_SUCCESS,
        payload: {
          items: [dis1, dis2],
          language: 'fr'
        }
      };
      const result = reducer(undefined, action);
      const expected: State = {
        entities: reduceItemsExpected
      };
      expect(result).toEqual(expected);
    });

    it('Without payload', () => {
      const action = {
        type: FETCH_SUCCESS
      };
      // $FlowFixMe this is to emulate an empty payload
      const result = reducer(undefined, action);
      expect(result).toEqual(expectedInitialState);
    });
  });
});
