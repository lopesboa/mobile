// @flow

import _fetch from 'cross-fetch';

import set from 'lodash/fp/set';
import {ForbiddenError} from '../models/error';

export const ERROR_MESSAGE = 'PLATFORM_DISABLED';

const fetch: typeof _fetch = async (url, options) => {
  const response = await _fetch(url, set('headers.X-Requested-With', 'XMLHttpRequest', options));
  if (response && response.status === 403) {
    try {
      const result = await response.json();
      if (result.err === ERROR_MESSAGE) {
        throw new ForbiddenError('Fetch Forbidden');
      }
    } catch (error) {
      throw new Error('Action not allowed');
    }
  }

  return response;
};

export default fetch;
