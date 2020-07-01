import decode from 'jwt-decode';
import type {LevelAPI} from '@coorpacademy/types/player-services';

import fetch from '../../modules/fetch';
import {get as getToken} from '../../utils/local-token';
import translations from '../../translations';
import type {JWT} from '../../types';
import {getItem} from './core';
import {CONTENT_TYPE} from './_const';
import type {Level, Discipline} from './_types';
import {mapToLevelAPI} from './mappers';
import {findByLevel as findDisciplineByLevel} from './disciplines';

export const findById = async (ref: string): Promise<LevelAPI> => {
  const language = translations.getLanguage();
  // @ts-ignore union type
  const item: Level = await getItem(CONTENT_TYPE.LEVEL, language, ref);
  return item && mapToLevelAPI(item);
};

export const getNextLevel = async (ref: string): Promise<LevelAPI | void> => {
  const discipline: Discipline | void = await findDisciplineByLevel(ref);

  if (!discipline) {
    return;
  }

  const levelIndex = discipline.modules.findIndex((mod) =>
    [mod.universalRef, mod.ref].includes(ref),
  );
  const nextLevel = discipline.modules[levelIndex + 1];

  if (!nextLevel) {
    return;
  }

  return findById(nextLevel.ref);
};

export const fetchLevel = async (ref: string): Promise<LevelAPI> => {
  const token = await getToken();

  if (!token) {
    throw new Error('Invalid token');
  }

  const jwt: JWT = decode(token);
  const response = await fetch(`${jwt.host}/api/v2/levels/${ref}`, {
    headers: {authorization: token},
  });

  return response.json();
};
