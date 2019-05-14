// @flow strict

import {ForbiddenError} from './error';

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
});
