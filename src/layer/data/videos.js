// @flow

import decode from 'jwt-decode';
import type {VideoProvider} from '@coorpacademy/player-services';

import {createVideoUrl} from '../../__fixtures__/videos';
import fetch from '../../modules/fetch';
import {__E2E__} from '../../modules/environment';
import type {JWT} from '../../types';
import {get as getToken} from '../../utils/local-token';

export const findUriById = async (id: string, provider: VideoProvider): Promise<string> => {
  if (__E2E__) {
    return createVideoUrl(id, provider);
  }

  const token = await getToken();

  if (!token) {
    throw new Error('Invalid token');
  }

  const jwt: JWT = decode(token);

  const response = await fetch(`${jwt.host}/api/v2/videos/${id}/provider/${provider}`, {
    headers: {
      authorization: token
    }
  });

  const {url} = await response.json();

  return url;
};
