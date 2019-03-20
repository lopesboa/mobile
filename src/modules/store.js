// @flow

import {Platform} from 'react-native';
import fetch from 'cross-fetch';
import compare from 'semver-compare';

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
  const minimalVersion = await getMinimalVersion();

  if (minimalVersion) {
    return compare(minimalVersion, version.tag) > 0;
  }

  return false;
};

export const getStoreUri = (): string => {
  if (Platform.OS === 'ios') {
    return `https://itunes.apple.com/app/apple-store/id${APP_STORE_ID}`;
  } else {
    return `https://play.google.com/store/apps/details?id=${PLAY_STORE_ID}`;
  }
};

export default {
  getMinimalVersion,
  needUpgrade,
  getStoreUri
};
