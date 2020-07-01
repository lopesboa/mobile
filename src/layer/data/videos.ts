import decode from 'jwt-decode';
import type {VideoProvider, VideoTrack, VideoTrackType} from '@coorpacademy/types/player-store';
import {VIDEO_TRACK_TYPE} from '@coorpacademy/player-store';

import {createVideoUri, createVideoTracks} from '../../__fixtures__/videos';
import fetch from '../../modules/fetch';
import {__E2E__} from '../../modules/environment';
import type {JWT} from '../../types';
import {get as getToken} from '../../utils/local-token';

export const findUriById = async (id: string, provider: VideoProvider): Promise<string> => {
  if (__E2E__) {
    return createVideoUri(id, provider);
  }

  const token = await getToken();

  if (!token) {
    throw new Error('Invalid token');
  }

  const jwt: JWT = decode(token);

  const response = await fetch(`${jwt.host}/api/v2/videos/${id}/provider/${provider}`, {
    headers: {
      authorization: token,
    },
  });

  const {url} = await response.json();

  return url;
};

export const findTracksById = async (
  id: string,
  type: VideoTrackType = VIDEO_TRACK_TYPE.VTT,
): Promise<Array<VideoTrack>> => {
  if (__E2E__) {
    return createVideoTracks(id, type);
  }

  const token = await getToken();

  if (!token) {
    throw new Error('Invalid token');
  }

  const jwt: JWT = decode(token);

  const response = await fetch(`${jwt.host}/api/v2/subtitles/video/${id}/${type}`, {
    headers: {
      authorization: token,
    },
  });

  return response.json();
};
