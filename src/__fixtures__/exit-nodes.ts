import type {Media} from '../types/coorpacademy/progression-engine';

import type {ExitNode, ExitNodeType} from '../layer/data/_types';
import {image} from './medias';

export const createExitNode = ({type, media}: {type: ExitNodeType; media?: Media}): ExitNode => ({
  _id: `${type}ExitNode`,
  ref: `${type}ExitNode`,
  type,
  title: 'title',
  description: 'description',
  meta: {
    updatedAt: '2018-10-07T13:45:40.510Z',
    createdAt: '2018-10-02T14:03:14.900Z',
  },
  // @ts-ignore union type
  media: media || image,
});
