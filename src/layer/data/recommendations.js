// @flow
import get from 'lodash/fp/get';
import map from 'lodash/fp/map';
import {find as findChapters} from './chapters';

const find = async (type: string, ref: string) => {
  const recommendations = map(chapter => ({
    view: 'grid',
    image: get('poster.mediaUrl', chapter),
    time: '8m',
    type: 'chapter',
    progress: 1,
    title: chapter.name,
    ref: chapter._id
  }))(await findChapters('en')());

  return Promise.resolve(recommendations);
};

const getNextLevel = (ref: string) => Promise.resolve(undefined);

export {find, getNextLevel};
