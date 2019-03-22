// @flow strict

import type {SupportedLanguage} from '../translations/_types';
import {getCleanUri} from './uri';

const SUBTITLES_ENDPOINT = '/api/v2/subtitles';

export const getSubtitlesUri = (host: string, ref: string, language: SupportedLanguage): string => {
  const hostWithoutDash = host.replace(/(.+)\/$/g, '$1');

  return getCleanUri(`${hostWithoutDash}${SUBTITLES_ENDPOINT}/${ref}.${language}.vtt`);
};

export default {
  getSubtitlesUri
};
