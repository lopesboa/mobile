// @flow

import _fetch from 'cross-fetch';
import {Platform} from 'react-native';

import get from 'lodash/fp/get';
import {ForbiddenError} from '../models/error';
import version from './version';

export const ERROR_MESSAGE = 'PLATFORM_DISABLED';

const fetch: typeof _fetch = async (url, options) => {
  const {OS, Version: OSVersion} = Platform;
  const appVersion = `${version.tag}.${version.commit}`;
  const userAgent = `Coorpacademy Mobile/${appVersion} ${OS}/${OSVersion}`;

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
