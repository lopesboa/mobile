// @flow

import {ERROR_TYPE} from '../../../const';
import {showError, hideError, SHOW, HIDE, refresh} from './errors';
import type {Action} from './errors';

const fakeAction = {
  type: 'FAKE_ACTION'
};
type FakeAction = typeof fakeAction;

describe('errors', () => {
  describe('show', () => {
    it('should return an action without callback', () => {
      const result = showError({type: ERROR_TYPE.NO_CONTENT_FOUND});
      const expected: Action<void> = {
        type: SHOW,
        payload: {
          type: ERROR_TYPE.NO_CONTENT_FOUND
        }
      };

      expect(result).toEqual(expected);
    });

    it('should return an action with callback', () => {
      const lastAction = jest.fn(() => fakeAction);
      const result = showError({
        type: ERROR_TYPE.NO_CONTENT_FOUND,
        lastAction
      });
      const expected: Action<FakeAction> = {
        type: SHOW,
        payload: {
          type: ERROR_TYPE.NO_CONTENT_FOUND,
          lastAction
        }
      };

      expect(result).toEqual(expected);
      result.payload && result.payload.lastAction && result.payload.lastAction();
      expect(lastAction).toHaveBeenCalled();
    });
  });

  describe('hide', () => {
    it('should return the action', () => {
      const action = hideError();
      expect(action).toEqual({
        type: HIDE
      });
    });
  });

  describe('refresh', () => {
    it('should only dispatch the hide errors action', () => {
      const dispatch = jest.fn();
      const getState = jest.fn();

      getState.mockReturnValue({
        error: {}
      });

      dispatch.mockImplementationOnce(action => action);

      // $FlowFixMe -- due to genericity of refresh function
      const actual = refresh()(dispatch, getState);
      return expect(actual).toEqual(hideError());
    });

    it('should dispatch the hide errors action and the last action', () => {
      const dispatch = jest.fn();
      const getState = jest.fn();
      const lastAction = () => {};

      getState.mockReturnValue({
        error: {
          lastAction: () => lastAction
        }
      });

      dispatch.mockImplementationOnce(action => {
        expect(action).toEqual(lastAction);
        return action;
      });

      dispatch.mockImplementationOnce(action => {
        return action;
      });
      // $FlowFixMe -- due to genericity of refresh function
      const actual: Action<FakeAction> = refresh()(dispatch, getState);
      return expect(actual).toEqual(hideError());
    });
  });
});
