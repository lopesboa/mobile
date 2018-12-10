// @flow strict

import {MEDIA_TYPE} from '../const';
import type {Media} from '../types';

const media: Media = {
  type: MEDIA_TYPE.IMAGE,
  source: require('./image.png'),
};

export default media;
