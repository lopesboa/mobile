// @flow strict

import translations from '../translations';
import {getCleanUri} from './uri';

const SUBTITLES_ENDPOINT = '/api/v2/subtitles';

export const getSubtitlesUri = (host: string, ref: string): string => {
  const hostWithoutDash = host.replace(/(.+)\/$/g, '$1');
  const language = translations.getLanguage();

  return getCleanUri(`${hostWithoutDash}${SUBTITLES_ENDPOINT}/${ref}.vtt?lang=${language}`);
};

export default {
  getSubtitlesUri
};
