// @flow strict

import {createDisciplineCard, createCardLevel} from '../__fixtures__/cards';
import type {DataLayer} from '../layer/data';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import {CARD_STATUS} from '../layer/data/_const';

export type HeroService = {|
  get: () => Promise<DisciplineCard | ChapterCard | void>
|};

export const get = (dataLayer: DataLayer) => () => {
  const level = createCardLevel({
    ref: 'mod_1',
    status: CARD_STATUS.ACTIVE,
    label: 'Fake level'
  });
  const card = createDisciplineCard({
    ref: 'dis1',
    completion: 0,
    levels: [level],
    title: 'Discipline'
  });

  return Promise.resolve(card);
};

const service = (dataLayer: DataLayer): HeroService => ({
  get: get(dataLayer)
});

export default service;
