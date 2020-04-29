// @flow strict

import url from 'url';
import type {Lesson} from '@coorpacademy/progression-engine';
import {RESOURCE_TYPE, VIDEO_MIME_TYPE} from '../const';

export const getCleanUri = (originalUri: string): string =>
  originalUri && originalUri.replace(/(http:|https:|)\/\//g, 'https://');

export const getResourceUrl = (resource: Lesson): string | void => {
  const videoId = resource && resource.videoId;

  if (resource.mimeType === VIDEO_MIME_TYPE.OMNIPLAYER) {
    // $FlowFixMe - interpolation
    return `https://mms.myomni.live/${videoId}`;
  }

  const mediaUrl = resource && resource.mediaUrl;
  const downloadUrl = resource && resource.downloadUrl;
  const link = (resource.type === RESOURCE_TYPE.VIDEO && downloadUrl) || mediaUrl;

  // This will remain here as a workaround to app crash for vimeo videos
  if (
    !link ||
    // $FlowFixMe - must be fixed in progression/engine package
    resource.mimeType === VIDEO_MIME_TYPE.KONTIKI ||
    resource.mimeType === VIDEO_MIME_TYPE.JWPLAYER
  ) {
    // $FlowFixMe - interpolation
    return `https://content.jwplatform.com/videos/${videoId}.mp4`;
  }

  return link;
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

export const getQueryParamsFromURL = (link: string): QueryParams => {
  const parsed = url.parse(link, true);
  // $FlowFixMe
  return parsed.query;
};
