// @flow strict

import type {Media} from '@coorpacademy/progression-engine';
import {MEDIA_TYPE} from '../const';

const media: Media = {
  type: MEDIA_TYPE.IMAGE,
  src: [
    {
      _id: '1',
      mimeType: 'image/jpeg',
      url:
        'https://www.coorpacademy.com/wp-content/uploads/2019/01/Difficult-Conversations-cours.jpg'
    }
  ]
};

export default media;
