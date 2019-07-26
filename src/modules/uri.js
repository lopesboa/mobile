// @flow strict

import type {Lesson} from '@coorpacademy/progression-engine';
import {RESOURCE_TYPE, VIDEO_PROVIDER_MIME_TYPE} from '../const';

export const getCleanUri = (originalUri: string): string =>
  originalUri && originalUri.replace(/(http:|https:|)\/\//g, 'https://');

export const getResourceUrl = (resource: Lesson): string | void => {
  const videoId = resource && resource.videoId;
  const mediaUrl = resource && resource.mediaUrl;
  const downloadUrl = resource && resource.downloadUrl;
  const url = (resource.type === RESOURCE_TYPE.VIDEO && downloadUrl) || mediaUrl;

  // This will remain here as a workaround to app crash for vimeo videos
  if (
    !url ||
    // $FlowFixMe - must be fixed in progression/engine package
    resource.mimeType === VIDEO_PROVIDER_MIME_TYPE.KONTIKI ||
    resource.mimeType === VIDEO_PROVIDER_MIME_TYPE.JWPLAYER
  ) {
    // $FlowFixMe - interpolation
    return `https://content.jwplatform.com/videos/${videoId}.mp4`;
  }
  return url;
};

export type QueryParams = {
  [key: string]: string | number | boolean
};

export const buildUrlQueryParams = (params: QueryParams) =>
  Object.keys(params)
    .map(key => {
      const value = params[key].toString();

      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .join('&');
