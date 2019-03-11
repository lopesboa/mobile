// @flow strict

import type {Lesson} from '@coorpacademy/progression-engine';
import {RESOURCE_TYPE} from '../const';

export const getCleanUri = (originalUri: string): string =>
  originalUri.replace(/(http:|https:|)\/\//g, 'https://');

export const getResourceUrl = (resource: Lesson): string | void => {
  const videoId = resource && resource.videoId;
  const mediaUrl = resource && resource.mediaUrl;
  const downloadUrl = resource && resource.downloadUrl;
  const url = (resource.type === RESOURCE_TYPE.VIDEO && downloadUrl) || mediaUrl;

  const jwpWithNoUrl = !url || resource.mimeType === 'application/jwplayer';

  if (jwpWithNoUrl && videoId !== undefined) {
    return `https://content.jwplatform.com/videos/${videoId}.mp4`;
  }

  return url;
};
