// @flow strict

import {ForbiddenError, NoContentFoundError, ConflictError} from './error';

describe('Error', () => {
  describe('ForbiddenError', () => {
    it('should instanciate a forbidden error type', () => {
      const error = new ForbiddenError('foo bar baz');

      expect(error.message).toEqual('foo bar baz');
      expect(error.name).toEqual('ForbiddenError');
      expect(error.description).toEqual(
        'Error encountered fetching an API having a response with 403 status code.'
      );
      expect(error.stack).toBeDefined();
    });
  });
  describe('NoContentFoundError', () => {
    it('should instanciate above described error type', () => {
      const error = new NoContentFoundError('foo bar baz');

      expect(error.message).toEqual('foo bar baz');
      expect(error.name).toEqual('NoContentFoundError');
      expect(error.description).toEqual(
        'Error encountered fetching an API having a response with 404 status code.'
      );
      expect(error.stack).toBeDefined();
    });
  });
  describe('ConflictError', () => {
    it('should instanciate above described error type', () => {
      const error = new ConflictError('foo bar baz');

      expect(error.message).toEqual('foo bar baz');
      expect(error.name).toEqual('ConflictError');
      expect(error.description).toEqual(
        'The request could not be completed due to a conflict with the current state of the target resource.'
      );
      expect(error.stack).toBeDefined();
    });
  });
});
