import {VIDEO_TRACK_KIND} from '@coorpacademy/player-store';
import type {VideoProvider, VideoTrack, VideoTrackType} from '../types/coorpacademy/player-store';

import {VIDEO_PROVIDER} from '../layer/data/_const';

export const createVideoUri = (id: string, provider: VideoProvider): string => {
  switch (provider) {
    case VIDEO_PROVIDER.JWPLAYER:
      return `https://content.jwplatform.com/videos/${id}.mp4`;
    case VIDEO_PROVIDER.OMNIPLAYER:
      return `https://mms.myomni.live/${id}`;
    default:
      throw new Error('Unsupported provider for fixtures');
  }
};

export const createVideoTracks = (id: string, type?: VideoTrackType): Array<VideoTrack> => [
  {
    kind: VIDEO_TRACK_KIND.CAPTIONS,
    file: 'https://content.jwplatform.com/tracks/foo.srt',
    label: 'fr',
    default: true,
  },
  {
    kind: VIDEO_TRACK_KIND.CAPTIONS,
    file: 'https://content.jwplatform.com/tracks/bar.srt',
    label: 'en',
  },
  {
    kind: VIDEO_TRACK_KIND.CAPTIONS,
    file: 'https://content.jwplatform.com/tracks/baz.srt',
    label: 'de',
  },
  {
    kind: VIDEO_TRACK_KIND.THUMBNAILS,
    file: 'https://content.jwplatform.com/strips/qux.vtt',
  },
];
