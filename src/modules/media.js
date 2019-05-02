// @flow

import type {Media, LessonType} from '@coorpacademy/progression-engine';
import {RESOURCE_TYPE} from '../const';
import {getCleanUri} from './uri';

export const getMediaType = (mediaItem: Media): LessonType | void => {
  return mediaItem.type;
};
export const getMediaUrl = (mediaItem: Media): string | void => {
  if (getMediaType(mediaItem) === RESOURCE_TYPE.VIDEO) {
    const resourceItem = mediaItem.src && mediaItem.src[0];
    return resourceItem && getCleanUri(resourceItem.url);
  }
  if (getMediaType(mediaItem) === RESOURCE_TYPE.PDF) {
    return mediaItem.mediaUrl && getCleanUri(mediaItem.mediaUrl);
  }

  if (getMediaType(mediaItem) === RESOURCE_TYPE.IMG) {
    if (mediaItem.src) {
      return getCleanUri(mediaItem.src[0].url);
    }
    return mediaItem.url && getCleanUri(mediaItem.url);
  }
};

export const getMediaPoster = (mediaItem: Media): string | void => {
  if (getMediaType(mediaItem) === RESOURCE_TYPE.VIDEO) {
    const resourceItem = mediaItem.src && mediaItem.src[0];
    return resourceItem && resourceItem.url && getCleanUri(resourceItem.url);
  }
};
