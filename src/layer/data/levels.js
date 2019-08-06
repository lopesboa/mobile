// @flow strict

import type {LevelAPI} from '@coorpacademy/player-services';

import translations from '../../translations';
import {getItem} from './core';
import {CONTENT_TYPE} from './_const';
import type {Level, Discipline} from './_types';
import {mapToLevelAPI} from './mappers';
import {findByLevel as findDisciplineByLevel} from './disciplines';

export const findById = async (ref: string): Promise<LevelAPI> => {
  const language = translations.getLanguage();
  // $FlowFixMe union type
  const item: Level = await getItem(CONTENT_TYPE.LEVEL, language, ref);
  return item && mapToLevelAPI(item);
};

export const getNextLevel = async (ref: string): Promise<LevelAPI | void> => {
  const discipline: Discipline | void = await findDisciplineByLevel(ref);

  if (!discipline) {
    return;
  }

  const levelIndex = discipline.modules.findIndex(mod => [mod.universalRef, mod.ref].includes(ref));
  const nextLevel = discipline.modules[levelIndex + 1];

  if (!nextLevel) {
    return;
  }

  return findById(nextLevel.ref);
};
