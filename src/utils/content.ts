import {DisciplineCard, CardLevel, ChapterCard, CardAuthor, ScormCard} from '../layer/data/_types';

export const pickNextCardLevel = (discipline: DisciplineCard): CardLevel | null => {
  // @ts-ignore
  return discipline.modules.reduce((selectedModule, currentModule) => {
    // @ts-ignore
    if (!selectedModule || selectedModule.completion === 1) {
      return currentModule;
    }

    return selectedModule;
  }, null);
};

export const compareCards = (
  cardA: DisciplineCard | ChapterCard,
  cardB: DisciplineCard | ChapterCard,
): number => {
  if (cardA.completion === 1 && cardB.completion === 1) return 0;

  if (cardB.completion === 1) return -1;
  if (cardA.completion === 1) return 1;

  return cardB.completion - cardA.completion;
};

export const getAuthor = (card: DisciplineCard | ChapterCard | ScormCard): CardAuthor | void =>
  card.authors && card.authors[0];
