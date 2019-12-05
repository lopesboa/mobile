// @flow

import _fetch from 'cross-fetch';
import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

import get from 'lodash/fp/get';
import {ForbiddenError} from '../models/error';
import version from './version';

export const ERROR_MESSAGE = 'PLATFORM_DISABLED';

const getUserAgent = async () => {
  const deviceBrand = await DeviceInfo.getBrand();
  const deviceModel = await DeviceInfo.getModel();
  const deviceVersion = await DeviceInfo.getSystemVersion();
  const appVersion = `${version.tag}`.slice(1);
  const baseUserAgent = `Coorpacademy Mobile/${appVersion} CFNetwork/897.15`;

  if (Platform.OS === 'android') {
    return `${baseUserAgent} Dalvik/2.1.0 (Linux; ${deviceBrand} ${deviceModel}; Android ${deviceVersion})`;
  }
  return `${baseUserAgent} Darwin/17.5.0 (${deviceModel} iOS/${deviceVersion})`;
};

const fetch: typeof _fetch = async (url, options) => {
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
