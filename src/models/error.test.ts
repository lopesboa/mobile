import {ForbiddenError, NotFoundError, ConflictError, NotAcceptableError} from './error';

describe('Error', () => {
  describe('ForbiddenError', () => {
    it('should instanciate a forbidden error type', () => {
      const error = new ForbiddenError('foo bar baz');

      expect(error.message).toEqual('foo bar baz');
      expect(error.name).toEqual('ForbiddenError');
      expect(error.description).toEqual(
        'Error encountered fetching an API having a response with 403 status code.',
      );
      expect(error.stack).toBeDefined();
    });
  });
  describe('NotFoundError', () => {
    it('should instanciate above described error type', () => {
      const error = new NotFoundError('foo bar baz');

      expect(error.message).toEqual('foo bar baz');
      expect(error.name).toEqual('NotFoundError');
      expect(error.description).toEqual(
        'Error encountered fetching an API having a response with 404 status code.',
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
        'Error encountered fetching an API having a response with 409 status code.',
      );
      expect(error.stack).toBeDefined();
    });
  });
  describe('NotAcceptableError', () => {
    it('should instanciate above described error type', () => {
      const error = new NotAcceptableError('foo bar baz');

      expect(error.message).toEqual('foo bar baz');
      expect(error.name).toEqual('NotAcceptableError');
      expect(error.description).toEqual(
        'Error encountered fetching an API having a response with 406 status code.',
      );
      expect(error.stack).toBeDefined();
    });
  });
});
