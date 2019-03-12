/* eslint-disable import/prefer-default-export */
// @flow strict

import type {DisciplineCard, CardLevel, ChapterCard} from '../layer/data/_types';

export const pickNextLevel = (discipline: DisciplineCard): CardLevel | null => {
  return discipline.modules.reduce((selectedModule, currentModule) => {
    if (!selectedModule) return currentModule;
    if (selectedModule.completion === 1) return currentModule;
    return selectedModule;
  }, null);
};

export const compareCards = (
  cardA: DisciplineCard | ChapterCard,
  cardB: DisciplineCard | ChapterCard
): number => {
  if (cardB.completion === 1) return -1;
  if (cardA.completion === 1) return 1;

  return cardB.completion - cardA.completion;
};
