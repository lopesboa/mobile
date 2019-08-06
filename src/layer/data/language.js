// @flow

import decode from 'jwt-decode';

import fetch from '../../modules/fetch';
import {__E2E__} from '../../modules/environment';
import type {JWT} from '../../types';
import translations from '../../translations';
import type {SupportedLanguage} from '../../translations/_types';
import {get as getToken} from '../../utils/local-token';

export const getInterfaceLanguage = () => translations.getInterfaceLanguage();

export const setLanguage = (language: SupportedLanguage) => translations.setLanguage(language);

export const getPlatformMatchingLanguage = (
  languages: Array<SupportedLanguage>
): string | SupportedLanguage | void => {
  const deviceLanguage = getInterfaceLanguage();

  if (languages.includes(deviceLanguage)) {
    return deviceLanguage;
  }

  const shortDeviceLanguage = deviceLanguage.split('-')[0];

  if (languages.includes(shortDeviceLanguage)) {
    return shortDeviceLanguage;
  }
};

export const getSelectedLanguage = (
  languages: Array<SupportedLanguage>,
  defaultLanguage: SupportedLanguage,
  matchingLanguage?: string | SupportedLanguage
): SupportedLanguage => {
  const selectedLanguage =
    matchingLanguage && languages.includes(matchingLanguage) ? matchingLanguage : defaultLanguage;

  // $FlowFixMe the returned value is SupportedLanguage
  return selectedLanguage;
};

export const fetchLanguage = async (): Promise<SupportedLanguage> => {
  if (__E2E__) {
    return Promise.resolve('en');
  }

  const token = await getToken();

  if (!token) {
    throw new Error('Invalid token');
  }

  const jwt: JWT = decode(token);

  const request = await fetch(`${jwt.host}/config`, {
    headers: {
      authorization: token
    }
  });

  const {
    supportedLngs,
    defaultLanguage
  }: {
    supportedLngs: Array<SupportedLanguage>,
    defaultLanguage: SupportedLanguage
  } = await request.json();

  const matchingLanguage = getPlatformMatchingLanguage(supportedLngs);
  const selectedLanguage = getSelectedLanguage(supportedLngs, defaultLanguage, matchingLanguage);

  return selectedLanguage;
};

export default {
  fetchLanguage,
  setLanguage,
  getInterfaceLanguage
};
