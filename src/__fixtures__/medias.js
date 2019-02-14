// @flow strict

import type {Media} from '@coorpacademy/progression-engine';

import {MEDIA_TYPE} from '../const';

const url =
  'https://api.coorpacademy.com/api-service/medias?url=https://static.coorpacademy.com/content/CoorpAcademy/content-eyrolles/cockpit-eyrolles/default/shutterstock_123603871-1-1545058448041.jpg&h=500&w=500&q=90&m=contain';

export const image: Media = {
  type: MEDIA_TYPE.IMAGE,
  src: [
    {
      _id: '1',
      mimeType: 'image/jpeg',
      url
    }
  ],
  url
};

export default {
  image
};
