// @flow strict

import {createSections} from '../__fixtures__/sections';
import type {DataLayer} from '../layer/data';
import type {DisciplineCard, ChapterCard} from '../layer/data/_types';
import {__E2E__} from '../modules/environment';

export type HeroService = {|
  get: () => Promise<DisciplineCard | ChapterCard | void>
|};

export const get = (dataLayer: DataLayer) => async (): Promise<
  DisciplineCard | ChapterCard | void
> => {
  if (__E2E__) {
    // @todo use right data layer
    const sections = createSections();
    const {cards} = await dataLayer.fetchCards('', '', sections[0], 0, 1);
    return cards[0];
  }
};

const service = (dataLayer: DataLayer): HeroService => ({
  get: get(dataLayer)
});

export default service;
