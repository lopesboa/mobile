// @flow strict

import {ForbiddenError} from '../../models/error';
import {showError} from '../actions/ui/errors';

import {ERROR_TYPE} from '../../const';
import createMiddleware from './error-handler';

const createStore = () => ({
  getState: jest.fn(),
  dispatch: jest.fn()
});

describe('Error handler', () => {
  it('shoud not handle unsupported action', () => {
    const action = {
      payload: {}
    };
    const middleware = createMiddleware();
    const store = createStore();
    const next = jest.fn();
    // $FlowFixMe this si to test only
    middleware(store)(next)(action);
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(action);
  });

  it('shoud handle an error with payload of type Forbidden Error', () => {
    const forbiddenError = new ForbiddenError('foo');
    const showErrorAction = showError({
      type: ERROR_TYPE.PLATFORM_NOT_ACTIVATED
    });
    const action = {
      payload: forbiddenError
    };
    const middleware = createMiddleware();
    const store = createStore();
    const next = jest.fn();
    // $FlowFixMe this si to test only
    middleware(store)(next)(action);
    expect(store.dispatch).toHaveBeenCalledWith(showErrorAction);
    expect(next).toHaveBeenCalledWith(action);
  });
});
