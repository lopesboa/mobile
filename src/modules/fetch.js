// @flow

import _fetch from 'cross-fetch';

import get from 'lodash/fp/get';

import {ForbiddenError} from '../models/error';
import {__E2E__} from './environment';
import {getUserAgent} from './build';

export const ERROR_MESSAGE = 'PLATFORM_DISABLED';

const fetch: typeof _fetch = async (url, options) => {
  if (__E2E__) {
    return 'Cannot be called from e2e mode';
  }

  const userAgent = await getUserAgent();

  const _options = {
    ...options,
    headers: {
      ...get('headers', options),
      'X-Requested-With': 'XMLHttpRequest',
      'User-Agent': userAgent
    }
  };

  const response = await _fetch(url, _options);
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
