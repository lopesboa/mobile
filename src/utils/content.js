// @flow strict

import type {DisciplineCard, CardLevel, ChapterCard, CardAuthor} from '../layer/data/_types';

export const pickNextCardLevel = (discipline: DisciplineCard): CardLevel | null => {
  return discipline.modules.reduce((selectedModule, currentModule) => {
    if (!selectedModule || selectedModule.completion === 1) {
      return currentModule;
    }

    return selectedModule;
  }, null);
};

export const compareCards = (
  cardA: DisciplineCard | ChapterCard,
  cardB: DisciplineCard | ChapterCard
): number => {
  if (cardA.completion === 1 && cardB.completion === 1) return 0;

  if (cardB.completion === 1) return -1;
  if (cardA.completion === 1) return 1;

  return cardB.completion - cardA.completion;
};

export const getAuthor = (card: DisciplineCard | ChapterCard): CardAuthor | void =>
  card.authors && card.authors[0];
