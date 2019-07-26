// @flow strict

import type {VideoProvider} from '@coorpacademy/player-services';

import {VIDEO_PROVIDER} from '../layer/data/_const';

export const createVideoUrl = (id: string, provider: VideoProvider): string => {
  switch (provider) {
    case VIDEO_PROVIDER.JWPLAYER:
      return `https://content.jwplatform.com/videos/${id}.mp4`;
    default:
      throw new Error('Unsupported provider for fixtures');
  }
};
