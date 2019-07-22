// @flow strict

import type {DisciplineCard, CardLevel, ChapterCard} from '../layer/data/_types';
import type {AuthorType} from '../types';

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

export const getAuthorType = (card: DisciplineCard | ChapterCard): AuthorType | void => {
  const author = card && card.authors && card.authors[0];
  return author && author.authorType;
};

export const getAuthorName = (card: DisciplineCard | ChapterCard): string | void => {
  const author = card && card.authors && card.authors[0];
  return author && author.label;
};
