// @flow strict

import type {SupportedLanguage} from '../../translations/_types';
import type {Discipline} from './_types';
import {CONTENT_TYPE} from './_const';
import {getItem, getItemsPerResourceType} from './core';

export const find = (userLanguage: SupportedLanguage) => async (
  ref: string
): Promise<Discipline | void> => {
  // $FlowFixMe union type
  const discipline: Discipline = await getItem(CONTENT_TYPE.DISCIPLINE, userLanguage, ref);

  return discipline;
};

export const findByChapter = (userLanguage: SupportedLanguage) => async (
  ref: string
): Promise<Discipline | void> => {
  // $FlowFixMe union type
  const disciplines: Array<Discipline> = await getItemsPerResourceType(
    CONTENT_TYPE.DISCIPLINE,
    userLanguage
  );
  const discipline = disciplines.find(item =>
    item.modules.find(mod => mod.chapterIds.includes(ref))
  );

  return discipline;
};

export const findByLevel = (userLanguage: SupportedLanguage) => async (
  ref: string
): Promise<Discipline | void> => {
  // $FlowFixMe union type
  const disciplines: Array<Discipline> = await getItemsPerResourceType(
    CONTENT_TYPE.DISCIPLINE,
    userLanguage
  );
  const discipline = disciplines.find(item =>
    item.modules.find(mod => [mod.ref, mod.universalRef].includes(ref))
  );

  return discipline;
};
