import {Platform} from 'react-native';
import {gt as isGreeterVersion} from 'semver';
import storeLink from 'app-store-link';

import {__PRODUCTION__, __E2E__} from './environment';
import fetch from './fetch';
import version from './version';

export const API_HOST = 'api.coorpacademy.com';
export const APP_STORE_ID = '1448348795';
export const PLAY_STORE_ID = 'com.coorpacademy.app';

export const getMinimalVersion = async (): Promise<string | void> => {
  const url = `https://${API_HOST}/mobile/api/v1/minimal-version/${Platform.OS}`;
  try {
    const response = await fetch(url);

    return response && response.text();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(`Fetch to ${url} rejected:`, e.toString());
  }
};

export const needUpgrade = async (): Promise<boolean> => {
  if (!__PRODUCTION__ || __E2E__) {
    return false;
  }

  const minimalVersion = await getMinimalVersion();

  if (minimalVersion) {
    return isGreeterVersion(minimalVersion, version.tag);
  }

  return false;
};

export const getStoreUri = (): string => {
  if (Platform.OS === 'android') {
    return storeLink.android(PLAY_STORE_ID);
  }

  return storeLink.ios(APP_STORE_ID);
};

export default {
  getMinimalVersion,
  needUpgrade,
  getStoreUri,
};
