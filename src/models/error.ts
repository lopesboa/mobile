export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);

    this.name = 'ForbiddenError';
    this.description = 'Error encountered fetching an API having a response with 403 status code.';

    Error.captureStackTrace && Error.captureStackTrace(this, ForbiddenError);
  }
}
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);

    this.name = 'NotFoundError';
    this.description = 'Error encountered fetching an API having a response with 404 status code.';

    Error.captureStackTrace && Error.captureStackTrace(this, NotFoundError);
  }
}
export class ConflictError extends Error {
  constructor(message: string) {
    super(message);

    this.name = 'ConflictError';
    this.description = 'Error encountered fetching an API having a response with 409 status code.';

    Error.captureStackTrace && Error.captureStackTrace(this, ConflictError);
  }
}
export class NotAcceptableError extends Error {
  constructor(message: string) {
    super(message);

    this.name = 'NotAcceptableError';
    this.description = 'Error encountered fetching an API having a response with 406 status code.';

    Error.captureStackTrace && Error.captureStackTrace(this, NotAcceptableError);
  }
}
