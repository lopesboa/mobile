// @flow

// @todo remove lodash
import get from 'lodash/fp/get';
// @todo remove lodash
import map from 'lodash/fp/map';

import translations from '../../translations';
import type {SupportedLanguage} from '../../translations/_types';
import {pickNextLevel} from '../../utils/content';
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
  }))(await findChapters(translations.getLanguage())());

  return Promise.resolve(recommendations);
};

const getNextLevel = (language: SupportedLanguage) => async (
  ref: string
): Promise<DisciplineCard | void> => {
  // $FlowFixMe
  const disciplineCard: DisciplineCard | void = await getCardFromLocalStorage(ref, language);

  if (!disciplineCard) return;

  const nextLevel = pickNextLevel(disciplineCard);

  if (!nextLevel || nextLevel.ref === ref || nextLevel.universalRef === ref) return;

  return disciplineCard;
};

export {find, getNextLevel};
