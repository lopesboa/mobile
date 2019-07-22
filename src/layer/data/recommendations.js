// @flow

import type {ChapterAPI, RecommendationAPI} from '@coorpacademy/player-services';

import translations from '../../translations';
import {CONTENT_TYPE} from './_const';
import {find as findChapters} from './chapters';

const find = async (type: string, ref: string): Promise<Array<RecommendationAPI>> => {
  const chapters: Array<ChapterAPI> = await findChapters(translations.getLanguage())();

  // $FlowFixMe this type is totally fucked up
  const recommendations: Array<RecommendationAPI> = chapters.map(chapter => ({
    view: 'grid',
    image: chapter && chapter.poster && chapter.poster.mediaUrl,
    time: '8m',
    type: CONTENT_TYPE.CHAPTER,
    progress: 1,
    title: chapter.name,
    ref: chapter._id
  }));

  return Promise.resolve(recommendations);
};

export {find};
