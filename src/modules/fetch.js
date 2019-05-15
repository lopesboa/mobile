// @flow strict

import _fetch from 'cross-fetch';

import {ForbiddenError} from '../models/error';

const fetch: typeof _fetch = async (...args) => {
  const result = await _fetch(...args);

  if (result && result.status === 403) {
    throw new ForbiddenError('Fetch Forbidden');
  }

  return result;
};

export default fetch;
