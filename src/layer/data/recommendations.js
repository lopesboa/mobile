// @flow

// @todo remove lodash
import get from 'lodash/fp/get';
// @todo remove lodash
import map from 'lodash/fp/map';

import type {SupportedLanguage} from '../../translations/_types';
import type {DisciplineCard} from './_types';
import {getCardFromLocalStorage} from './cards';
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

const getNextLevel = (language: SupportedLanguage) => async (
  ref: string
): Promise<DisciplineCard> => {
  // $FlowFixMe
  const disciplineCard = await getCardFromLocalStorage(ref, language);
  // $FlowFixMe
  return disciplineCard;
};

export {find, getNextLevel};
