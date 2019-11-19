// @flow strict

import {ERROR_TYPE} from '../../../const';
import {SHOW, HIDE} from '../../actions/ui/errors';
import type {Action} from '../../actions/ui/errors';
import reducer from './errors';
import type {State} from './errors';

const fakeAction = {
  type: 'FAKE_ACTION'
};
type FakeAction = typeof fakeAction;

describe('Errors', () => {
  const expectedInitialState: State<FakeAction> = {
    isVisible: false
  };

  it('Default', () => {
    // $FlowFixMe we are trying to emulate something else
    const result = reducer(expectedInitialState, () => fakeAction);
    expect(result).toEqual(expectedInitialState);
  });

  describe(SHOW, () => {
    it('Default', () => {
      const lastAction = jest.fn(() => fakeAction);
      const action: Action<FakeAction> = {
        type: SHOW,
        payload: {
          type: ERROR_TYPE.NO_CONTENT_FOUND,
          lastAction
        }
      };
      const result = reducer(expectedInitialState, action);
      const expected = {
        isVisible: true,
        type: ERROR_TYPE.NO_CONTENT_FOUND,
        lastAction
      };
      expect(result).toEqual(expected);
    });
  });

  describe(HIDE, () => {
    it('Default', () => {
      const action: Action<void> = {
        type: HIDE
      };
      const result = reducer(undefined, action);
      const expected = expectedInitialState;
      expect(result).toEqual(expected);
    });
  });
});
