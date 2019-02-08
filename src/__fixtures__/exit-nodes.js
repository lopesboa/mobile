// @flow strict
import type {ExitNode} from '../layer/data/types';

export const failureExitNode: ExitNode = {
  ref: 'failExitNode',
  _id: 'string',
  __v: 18,
  type: 'failure',
  description: 'description',
  title: 'title',
  meta: {
    updatedAt: '2018-10-07T13:45:39.834Z',
    createdAt: '2018-10-02T14:03:14.872Z'
  },
  media: {
    _id: 'id',
    subtitles: [],
    posters: [],
    src: []
  }
};

export const successExitNode: ExitNode = {
  ref: 'successExitNode',
  _id: 'string',
  __v: 18,
  type: 'success',
  title: 'title',
  description: 'description',
  meta: {
    updatedAt: '2018-10-07T13:45:40.510Z',
    createdAt: '2018-10-02T14:03:14.900Z'
  },
  media: {
    subtitles: [],
    posters: [],
    src: []
  }
};
