// @flow strict

import _fetch from 'cross-fetch';

import {ForbiddenError} from '../models/error';

const fetch: typeof _fetch = async (...args) => {
  try {
    return await _fetch(...args);
  } catch (e) {
    if (e.status === 403) {
      throw new ForbiddenError(e.message);
    }

    throw e;
  }
};

export default fetch;
