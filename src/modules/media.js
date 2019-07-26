// @flow

import type {Media, LessonType, Lesson} from '@coorpacademy/progression-engine';
import type {VideoProvider} from '@coorpacademy/player-store';

import {VIDEO_PROVIDER} from '../layer/data/_const';
import {RESOURCE_TYPE, VIDEO_PROVIDER_MIME_TYPE} from '../const';
import type {MimeType} from '../types';
import {getCleanUri, getResourceUrl} from './uri';

export const getMediaType = (mediaItem: Media | Lesson): LessonType | void => {
  return mediaItem.type;
};

export const getMediaUrl = (mediaItem: Media | Lesson): string | void => {
  if (getMediaType(mediaItem) === RESOURCE_TYPE.VIDEO) {
    if (mediaItem.videoId) {
      // here flow cannot determine for sure if the mediaItem is either  a mediaItem or a Lesson.
      // this is mainly due to `getQuestionMedia` can return a Media or a Lesson
      // $FlowFixMe;
      const lesson: Lesson = mediaItem;
      return getResourceUrl(lesson);
    }
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

export const getVideoProvider = (mimeType: MimeType): VideoProvider | void => {
  switch (mimeType) {
    case VIDEO_PROVIDER_MIME_TYPE.JWPLAYER:
      return VIDEO_PROVIDER.JWPLAYER;
    case VIDEO_PROVIDER_MIME_TYPE.KONTIKI:
      return VIDEO_PROVIDER.KONTIKI;
    case VIDEO_PROVIDER_MIME_TYPE.VIMEO:
      return VIDEO_PROVIDER.VIMEO;
  }
};
