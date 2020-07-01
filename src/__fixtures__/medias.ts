import type {Media} from '../types/coorpacademy/progression-engine';

import {MEDIA_TYPE, RESOURCE_TYPE} from '../const';

const url =
  'https://api.coorpacademy.com/api-service/medias?url=https://static.coorpacademy.com/content/CoorpAcademy/content-eyrolles/cockpit-eyrolles/default/shutterstock_123603871-1-1545058448041.jpg&h=500&w=500&q=90&m=contain';

export const image: Media = {
  type: MEDIA_TYPE.IMAGE,
  src: [
    {
      _id: '1',
      mimeType: 'image/jpeg',
      url,
    },
  ],
  url,
};

export const video: Media = {
  type: RESOURCE_TYPE.VIDEO,
  src: [
    {
      mimeType: 'video/mp4',
      url:
        '//player.vimeo.com/external/266296552.m3u8?s=316e71edf867847e1f648655833e41cce19da389&oauth2_token_id=411503075',
      _id: 'some_randoMId',
    },
  ],
};

export const pdf: Media = {
  type: RESOURCE_TYPE.PDF,
  mediaUrl: url,
};

export const emptyMedia: Media = {
  type: RESOURCE_TYPE.VIDEO,
};

export default {
  video,
  image,
  pdf,
};
