// @flow strict

import type {LevelAPI} from '@coorpacademy/player-services';

import type {SupportedLanguage} from '../../translations/_types';
import {getItem} from './core';
import {CONTENT_TYPE} from './_const';
import type {Level, Discipline} from './_types';
import {mapToLevelAPI} from './mappers';
import {findByLevel as findDisciplineByLevel} from './disciplines';

export const findById = (userLanguage: SupportedLanguage) => async (
  ref: string
): Promise<LevelAPI> => {
  // $FlowFixMe union type
  const item: Level = await getItem(CONTENT_TYPE.LEVEL, userLanguage, ref);
  return item && mapToLevelAPI(item);
};

export const getNextLevel = (userLanguage: SupportedLanguage) => async (
  ref: string
): Promise<LevelAPI | void> => {
  const discipline: Discipline | void = await findDisciplineByLevel(userLanguage)(ref);

  if (!discipline) {
    return;
  }

  const levelIndex = discipline.modules.findIndex(mod => [mod.universalRef, mod.ref].includes(ref));
  const nextLevel = discipline.modules[levelIndex + 1];

  if (!nextLevel) {
    return;
  }

  return findById(userLanguage)(nextLevel.ref);
};
