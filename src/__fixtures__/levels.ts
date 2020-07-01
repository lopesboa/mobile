import type {LevelAPI} from '../types/coorpacademy/player-services';

import type {Level, LevelType} from '../layer/data/_types';
import {mapToLevelAPI} from '../layer/data/mappers';

export const createLevelName = ({level = 'base'}: {level?: LevelType}): string => {
  if (level === 'base') {
    return 'Basic';
  }

  return level.charAt(0).toUpperCase() + level.slice(1);
};

export const createLevel = ({
  ref,
  chapterIds,
  bestScore,
  level = 'base',
  shuffleChoices,
  levelTranslation,
}: {
  ref: string;
  chapterIds: Array<string>;
  bestScore?: number;
  level?: LevelType;
  shuffleChoices?: boolean;
}): Level => ({
  _id: `id_${ref}`,
  taggedNewUntil: '2018-12-08T09:07:19.302Z',
  timeAlloted: 15,
  name: 'How to play on the platform?',
  levelTranslation: createLevelName({level}),
  mediaUrl:
    'https://static.coorpacademy.com/content/CoorpAcademy/content-catalogue/cockpit-tutorial-course/default/iphone__mockup-1531230955049.jpg',
  level,
  universalRef: ref,
  deliverCoachStatus: true,
  ref: ref,
  eligibleBattle: true,
  creditsToAccess: 0,
  infiniteLives: false,
  shuffleChoices,
  isConditional: false,
  data: [],
  stats: {
    userTriesCount: 0,
    userDoneCount: 0,
  },
  chapterIds,
  acquiredSkills: [
    'Définir la data, le big data, la smart data, et comprendre leur importance',
    'Appréhender comment la construction d’une culture data peut servir l’entreprise',
    "Identifier les enjeux liés à un champ d’application majeur de la donnée : l'Intelligence Artificielle",
  ],
  version: '2',
  external_refs: [],
  bestScore,
});

export const createLevelAPI = ({
  ref,
  chapterIds,
  bestScore,
  level = 'base',
  disciplineRef,
  disciplineUniversalRef,
}: {
  ref: string;
  chapterIds: Array<string>;
  bestScore?: number;
  level?: LevelType;
  disciplineRef?: string;
  disciplineUniversalRef?: string;
}): LevelAPI =>
  mapToLevelAPI({
    ...createLevel({ref, chapterIds, bestScore, level}),
    disciplineRef,
    disciplineUniversalRef,
  });

export default {
  createLevel,
};
