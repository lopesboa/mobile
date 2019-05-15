// @flow strict

import {ForbiddenError} from '../../models/error';
import {showModal} from '../actions/ui/modal';

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
    const showModalAction = showModal({
      errorType: ERROR_TYPE.PLATFORM_NOT_ACTIVATED
    });
    const action = {
      payload: forbiddenError
    };
    const middleware = createMiddleware();
    const store = createStore();
    const next = jest.fn();
    // $FlowFixMe this si to test only
    middleware(store)(next)(action);
    expect(store.dispatch).toHaveBeenCalledWith(showModalAction);
    expect(next).toHaveBeenCalledWith(action);
  });
});
