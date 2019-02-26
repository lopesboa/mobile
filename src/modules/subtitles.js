// @flow strict

import {getCleanUri} from './uri';

const SUBTITLES_ENDPOINT = '/api/v2/subtitles';

export const getSubtitlesUri = (host: string, ref: string): string => {
  const hostWithoutDash = host.replace(/(.+)\/$/g, '$1');

  return getCleanUri(`${hostWithoutDash}${SUBTITLES_ENDPOINT}/${ref}/vtt`);
};

export default {
  getSubtitlesUri
};
